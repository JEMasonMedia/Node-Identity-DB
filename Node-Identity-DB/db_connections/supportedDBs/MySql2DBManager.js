import mysql from 'mysql2/promise'
import knex from 'knex'

const MySql2DBManager = {
  connectDB: async (connectionConfig, additionalConfig) => {
    try {
      // const conn = await mysql.createConnection(connectionConfig)

      const conn = knex({
        client: 'mysql2',
        connectionConfig,
      })

      return conn
    } catch (err) {
      return { err }
    }
  },
  disconnectDB: async (dbConn) => {
    try {
      let str = dbConn.DBconnID
      await dbConn.connection.destroy()
      return str
    } catch (err) {
      return { err }
    }
  },
}

export default MySql2DBManager
