import mysql from 'mysql2/promise'
import knex from 'knex'

export default class MongoDBManager {
  static connectDB = async (connectionConfig, additionalConfig) => {
    try {
      const conn = knex({
        client: 'mysql2',
        connectionConfig,
      })

      return conn
    } catch (err) {
      return { err }
    }
  }

  static disconnectDB = async (dbConn) => {
    try {
      let str = dbConn.connectionName
      await dbConn.connection.destroy()
      return str
    } catch (err) {
      return { err }
    }
  }

  static modifyTable = async (dbConn, modelName) => {
    try {
      console.log(await dbConn.connection.schema)
      /*
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
*/
      return true
    } catch (err) {
      return { err }
    }
  }
}
