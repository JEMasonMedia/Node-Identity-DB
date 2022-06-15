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
    let res = await this.connection
      .db()
      .collection(modelArgs.modelName)
      // .find(...modelArgs.query)
      .find(modelArgs.query[0])
      .project(modelArgs.query[1])
    // console.log(this.connection.db().collection(modelArgs.modelName).find())
    return res.toArray()
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
}
