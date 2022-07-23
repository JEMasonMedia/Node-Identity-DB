import { MongoClient } from 'mongodb'
import MongoDBTranslator from '../Translators/MongoDBTranslator.js'

export default class MongoDBManager {
  dbType = 'MONGODB'
  translator = new MongoDBTranslator()
  connection = null

  connectDB = async (connectionConfig, additionalConfig) => {
    try {
      // this needs to be fleshed out
      // for atlas
      // mongodb+srv://testuser:<password>@cluster0.41s0m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
      // for local -- if local is auth enabled would be similar to for atlas
      // MONGO_URI=mongodb://127.0.0.1:27017

      let mongoURI = ''

      const dbPass = connectionConfig.user && connectionConfig.password ? `${connectionConfig.user}:${connectionConfig.password}@` : null

      if (dbPass === null) mongoURI = `mongodb://${connectionConfig.host}:${connectionConfig.port}/${connectionConfig.database}`
      else mongoURI = `mongodb+srv://${userPass}${connectionConfig.host}/${connectionConfig.database}?retryWrites=true&w=majority`

      this.connection = new MongoClient(mongoURI)
      await this.connection.connect()

      return true
    } catch (err) {
      return { err }
    }
  }

  disconnectDB = async () => {
    try {
      await this.connection.close()
      return true
    } catch (err) {
      return { err }
    }
  }

  raw = async modelArgs => {
    try {
      const method = Object.keys(modelArgs.query)[0]
      if (!this.#methods.includes(method)) throw new Error('Invalid method')
      let query = modelArgs.query[method]

      const project = modelArgs.query.project && modelArgs.query.project
      const sort = modelArgs.query.sort && modelArgs.query.sort
      const limit = (modelArgs.query.limit && modelArgs.query.limit) || 0
      const skip = (modelArgs.query.skip && modelArgs.query.skip) || 0
      const collection = this.connection.db().collection(modelArgs.modelName)

      let result = await collection[method](query)?.project(project)?.sort(sort)?.limit(limit)?.skip(skip)?.toArray()

      return result
    } catch (err) {
      return { err }
    }
  }

  tableExists = async model => {
    try {
      const exists = await this.connection.db().listCollections({ name: model.modelName }).toArray()
      return exists.length > 0
    } catch (err) {
      return { err }
    }
  }

  createTable = async model => {
    try {
      await this.connection.db().createCollection(model.modelName)
      return true
    } catch (err) {
      if (err.toString().includes('Collection already exists')) return { err: 'Table already exists' }
      return { err }
    }
  }

  renameField = async (model, oldFieldName, newFieldName) => {
    try {
      await this.connection
        .db()
        .collection(model.modelName)
        .updateMany({}, { $rename: { [oldFieldName]: newFieldName } })
      return true
    } catch (err) {
      return { err }
    }
  }

  alterTable = async (model, preserveData) => {
    try {
      const collection = await this.connection.db().collection(model.modelName)
      const numDocs = await collection.countDocuments()

      if (numDocs < 1) return { err: 'No records, cannot modify' }

      const fields = Object.keys(model.model)
      const pageSize = 100
      const numPages = Math.ceil(numDocs / pageSize)

      for (let i = 0; i < numPages; i++) {
        const cursor = await collection
          .find({})
          .skip(i * pageSize)
          .limit(pageSize)
        const docs = await cursor.toArray()
        for (let j = 0; j < docs.length; j++) {
          const doc = docs[j]
          const docKeys = Object.keys(doc)
          let trigger = false
          for (let k = 0; k < fields.length; k++) {
            const key = fields[k]
            if (!docKeys.includes(key)) {
              doc[key] = model.getDefaultValue(model.model[key].type, model.model[key])
              trigger = true
            }
          }
          if (trigger) await collection.updateOne({ _id: doc._id }, { $set: doc })
          trigger = false

          for (let k = 0; k < docKeys.length; k++) {
            const key = docKeys[k]
            if (!fields.includes(key)) {
              delete doc[key]
              if (preserveData) await collection.updateOne({ _id: doc._id }, { $rename: { [key]: `preserved_${key}` } })
              else await collection.updateOne({ _id: doc._id }, { $unset: { [key]: 1 } })
            }
          }
        }
      }
      return true
    } catch (err) {
      return { err }
    }
  }

  #methods = ['aggregate', 'bulkWrite', 'count', 'countDocuments', 'createIndex', 'createIndexes', 'dataSize', 'deleteOne', 'deleteMany', 'distinct', 'drop', 'dropIndex', 'dropIndexes', 'estimatedDocumentCount', 'explain', 'find', 'findAndModify', 'findOne', 'findOneAndDelete', 'findOneAndReplace', 'findOneAndUpdate', 'getIndexes', 'getShardDistribution', 'getShardVersion', 'hideIndex', 'insertOne', 'insertMany', 'isCapped', 'latencyStats', 'mapReduce', 'reIndex', 'remove', 'renameCollection', 'replaceOne', 'stats', 'storageSize', 'totalIndexSize', 'totalSize', 'unhideIndex', 'updateOne', 'updateMany', 'watch', 'validate']

  #methodFunctions = {
    aggregate: async (modelName, query) => {
      return await this.connection.db().collection(modelName).aggregate(query).toArray()
    },
    bulkWrite: async (modelName, query) => {
      return await this.connection.db().collection(modelName).bulkWrite(query)
    },
    count: async (modelName, query) => {
      return await this.connection.db().collection(modelName).count(query)
    },
    countDocuments: async (modelName, query) => {
      return await this.connection.db().collection(modelName).countDocuments(query)
    },
    createIndex: async (modelName, query) => {
      return await this.connection.db().collection(modelName).createIndex(query)
    },
    createIndexes: async (modelName, query) => {
      return await this.connection.db().collection(modelName).createIndexes(query)
    },
    dataSize: async (modelName, query) => {
      return await this.connection.db().collection(modelName).dataSize(query)
    },
    deleteOne: async (modelName, query) => {
      return await this.connection.db().collection(modelName).deleteOne(query)
    },
    deleteMany: async (modelName, query) => {
      return await this.connection.db().collection(modelName).deleteMany(query)
    },
    distinct: async (modelName, query) => {
      return await this.connection.db().collection(modelName).distinct(query)
    },
    drop: async (modelName, query) => {
      return await this.connection.db().collection(modelName).drop(query)
    },
    dropIndex: async (modelName, query) => {
      return await this.connection.db().collection(modelName).dropIndex(query)
    },
    dropIndexes: async (modelName, query) => {
      return await this.connection.db().collection(modelName).dropIndexes(query)
    },
    estimatedDocumentCount: async (modelName, query) => {
      return await this.connection.db().collection(modelName).estimatedDocumentCount(query)
    },
    explain: async (modelName, query) => {
      return await this.connection.db().collection(modelName).explain(query)
    },
    find: async (modelName, query) => {
      return await this.connection.db().collection(modelName).find(query)
    },
    findAndModify: async (modelName, query) => {
      return await this.connection.db().collection(modelName).findAndModify(query)
    },
    findOne: async (modelName, query) => {
      return await this.connection.db().collection(modelName).findOne(query)
    },
    findOneAndDelete: async (modelName, query) => {
      return await this.connection.db().collection(modelName).findOneAndDelete(query)
    },
    findOneAndReplace: async (modelName, query) => {
      return await this.connection.db().collection(modelName).findOneAndReplace(query)
    },
    findOneAndUpdate: async (modelName, query) => {
      return await this.connection.db().collection(modelName).findOneAndUpdate(query)
    },
    createIndexes: async (modelName, query) => {
      return await this.connection.db().collection(modelName).createIndexes(query)
    },
    insertMany: async (modelName, query) => {
      return await this.connection.db().collection(modelName).insertMany(query)
    },
    insertOne: async (modelName, query) => {
      return await this.connection.db().collection(modelName).insertOne(query)
    },
    isCapped: async (modelName, query) => {
      return await this.connection.db().collection(modelName).isCapped(query)
    },
    listIndexes: async (modelName, query) => {
      return await this.connection.db().collection(modelName).listIndexes(query)
    },
    mapReduce: async (modelName, query) => {
      return await this.connection.db().collection(modelName).mapReduce(query)
    },
    reIndex: async (modelName, query) => {
      return await this.connection.db().collection(modelName).reIndex(query)
    },
    remove: async (modelName, query) => {
      return await this.connection.db().collection(modelName).remove(query)
    },
    renameCollection: async (modelName, query) => {
      return await this.connection.db().collection(modelName).renameCollection(query)
    },
    replaceOne: async (modelName, query) => {
      return await this.connection.db().collection(modelName).replaceOne(query)
    },
    stats: async (modelName, query) => {
      return await this.connection.db().collection(modelName).stats(query)
    },
    updateMany: async (modelName, query) => {
      return await this.connection.db().collection(modelName).updateMany(query)
    },
    updateOne: async (modelName, query) => {
      return await this.connection.db().collection(modelName).updateOne(query)
    },
    watch: async (modelName, query) => {
      return await this.connection.db().collection(modelName).watch(query)
    },
    validate: async (modelName, query) => {
      return await this.connection.db().collection(modelName).validate(query)
    },
  }
}
