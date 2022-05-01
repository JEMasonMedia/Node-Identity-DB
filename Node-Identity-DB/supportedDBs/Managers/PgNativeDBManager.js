// copy paste not working

const PgNativeDBManager = {
  connectDB: async (connectionConfig, additionalConfig) => {
    try {
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

export default PgNativeDBManager
