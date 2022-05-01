import mysql from 'mysql2/promise'
import knex from 'knex'

export default class MongoDBManager {
  static async connectDB(connectionConfig, additionalConfig) {
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

  static async disconnectDB(dbConn) {
    try {
      let str = dbConn.DBconnID
      await dbConn.connection.destroy()
      return str
    } catch (err) {
      return { err }
    }
  }
}
