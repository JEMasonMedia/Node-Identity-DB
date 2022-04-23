import mongoose from 'mongoose'

const manageMongo = {
  connectMongo: async (connectionConfig, additionalConfig) => {
    try {
      const conn = await mongoose.connect(
        connectionConfig?.mongoURI,
        additionalConfig
      )
      return conn.connection
    } catch (err) {
      return { err }
    }
  },
  disconnectMongo: async (dbConn) => {
    try {
      let str = dbConn.DBconnID
      await dbConn.connection.close()
      return str
    } catch (err) {
      return { err }
    }
  },
}

export default manageMongo
