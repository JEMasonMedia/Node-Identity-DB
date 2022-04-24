import mongoose from 'mongoose'

//MONGO_URI=mongodb://127.0.0.1:27017
const MongoDBManager = {
  connectDB: async (connectionConfig, additionalConfig) => {
    try {
      // this needs to be fleshed out
      // for atlas
      // mongodb+srv://testuser:<password>@cluster0.41s0m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
      // for local -- if local is auth enabled would be similar to for atlas
      // MONGO_URI=mongodb://127.0.0.1:27017

      let mongoURI = ''

      const userPass =
        connectionConfig.user && connectionConfig.password
          ? `${connectionConfig.user}:${connectionConfig.password}@`
          : null

      if (userPass === null)
        mongoURI = `mongodb://${connectionConfig.host}:${connectionConfig.port}/${connectionConfig.database}`
      else
        mongoURI = `mongodb+srv://${userPass}${connectionConfig.host}/${connectionConfig.database}?retryWrites=true&w=majority`

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
