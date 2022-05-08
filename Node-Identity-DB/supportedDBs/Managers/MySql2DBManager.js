import mysql from 'mysql2/promise'
import knex from 'knex'

export default class MySql2DBManager {
  static connectDB = async (connectionConfig, additionalConfig) => {
    try {
      // const conn = knex({
      //   client: 'mysql2',
      //   connectionConfig,
      // })

      // conn.raw('SELECT VERSION()').then((version) => console.log(version[0][0]))

      const conn = await mysql.createConnection(connectionConfig)
      await conn.connect()

      return conn
    } catch (err) {
      return { err }
    }
  }

  static disconnectDB = async (dbConn) => {
    try {
      // await dbConn.connection.destroy()
      await dbConn.connection.end()
      return dbConn.connectionName
    } catch (err) {
      return { err }
    }
  }

  static createModifyTable = async (dbConn, modelName) => {
    try {
      // const query = `SHOW TABLES LIKE "items2"`
      //const q2 = `SELECT * FROM information_schema.tables WHERE table_schema = '${dbConn.connectionConfig.database}' AND table_name = '${modelName}' LIMIT 1`
      const tableExistsQuery = dbConn.tableExists(modelName)
      // console.log(await dbConn.connection.query(query))
      const tableExists = await dbConn.connection.query(tableExistsQuery)
      // console.log(tableExists)

      console.log(dbConn.createTable(modelName))

      // if (tableExists[0].length > 0) {
      //   //nothing to do
      // } else {
      //   const createTableQuery = `CREATE TABLE ${modelName} (
      //     _id VARCHAR(255) PRIMARY KEY,
      //     name VARCHAR(255) NOT NULL,
      //     description VARCHAR(255) NULL,
      //     quantity INT NOT NULL
      //   )`
      //   await dbConn.connection.query(createTableQuery)
      // }

      // console.log(await dbConn.connection.schema)
      // console.log(await dbConn.connection.table).table(dbConn.connectionName)
      // const test = await dbConn.connection
      //   .raw('SELECT VERSION()')
      //   .then((version) => console.log(version[0][0]))
      //   .catch((err) => {
      //     console.log(err)
      //     throw err
      //   })
      // console.log(test)

      // await dbConn.connection.schema.hasTable(modelName).then((exists) => {
      //   if (!exists) {
      //     return dbConn.schema.createTable(modelName, (table) => {
      //       table.increments('_id').primary()
      //       table.string('name').notNullable()
      //       table.string('description').nullable()
      //       table.string('quantity').notNullable()
      //     })
      //   }
      // })
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
