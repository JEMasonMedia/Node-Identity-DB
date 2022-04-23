import mysql from 'mysql2/promise'

const MySql2DBManager = {
  connectDB: async (connectionConfig, additionalConfig) => {
    try {
      const conn = await mysql.createConnection(connectionConfig)
      return conn.connection
    } catch (err) {
      return { err }
    }
  },
  disconnectDB: async (dbConn) => {
    try {
      let str = dbConn.DBconnID
      await dbConn.connection.end()
      return str
    } catch (err) {
      return { err }
    }
  },
}

export default MySql2DBManager
