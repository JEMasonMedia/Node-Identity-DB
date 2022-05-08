import { MongoClient } from 'mongodb'
import modelManager from '../../model_conversions/modelManager.js'

export default class MongoDBManager {
  static connectDB = async (connectionConfig, additionalConfig) => {
    try {
      // this needs to be fleshed out
      // for atlas
      // mongodb+srv://testuser:<password>@cluster0.41s0m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
      // for local -- if local is auth enabled would be similar to for atlas
      // MONGO_URI=mongodb://127.0.0.1:27017

      let mongoURI = ''

      const dbPass =
        connectionConfig.user && connectionConfig.password
          ? `${connectionConfig.user}:${connectionConfig.password}@`
          : null

      if (dbPass === null)
        mongoURI = `mongodb://${connectionConfig.host}:${connectionConfig.port}/${connectionConfig.database}`
      else
        mongoURI = `mongodb+srv://${userPass}${connectionConfig.host}/${connectionConfig.database}?retryWrites=true&w=majority`

      const client = new MongoClient(mongoURI)
      await client.connect()

      return client
    } catch (err) {
      return { err }
    }
  }

  static disconnectDB = async (dbConn) => {
    try {
      await dbConn.connection.close()
      return dbConn.connectionName
    } catch (err) {
      return { err }
    }
  }

  static createModifyTable = async (dbConn, modelName) => {
    try {
      const collection = await dbConn.connection.db().collection(modelName)
      const numDocs = await collection.countDocuments()
      const fields = Object.keys(dbConn.models[modelName].model)
      const model = dbConn.models[modelName].model
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
              doc[key] = modelManager.getDefaultValue(
                model[key].type,
                model[key]
              )
              trigger = true
            }
          }
          if (trigger)
            await collection.updateOne({ _id: doc._id }, { $set: doc })
          trigger = false

          for (let k = 0; k < docKeys.length; k++) {
            const key = docKeys[k]
            if (!fields.includes(key)) {
              delete doc[key]
              let t = { [key]: 1 }
              await collection.updateMany({}, { $unset: { [key]: 1 } })
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
