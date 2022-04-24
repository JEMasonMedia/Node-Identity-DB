import mongoose from 'mongoose'

//MONGO_URI=mongodb://127.0.0.1:27017
const MongoDBManager = {
  connectDB: async (connectionConfig, additionalConfig) => {
    try {
      const mongoURI = `mongodb://${connectionConfig.host}:${connectionConfig.port}`
      const conn = await mongoose.connect(
        mongoURI,
        connectionConfig.dbExtraConfig
      )
      return conn.connection
    } catch (err) {
      return { err }
    }
  },
  disconnectDB: async (dbConn) => {
    try {
      let str = dbConn.DBconnID
      await dbConn.connection.close()
      return str
    } catch (err) {
      return { err }
    }
  },
}

export default MongoDBManager
