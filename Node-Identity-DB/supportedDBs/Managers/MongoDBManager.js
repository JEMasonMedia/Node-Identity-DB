import { MongoClient } from 'mongodb'

export default class MongoDBManager {
  static async connectDB(connectionConfig, additionalConfig) {
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

      // console.log(client.db)

      return client
    } catch (err) {
      return { err }
    }
  }

  static async disconnectDB(dbConn) {
    try {
      let str = dbConn.DBconnID
      await dbConn.connection.close()
      return str
    } catch (err) {
      return { err }
    }
  }

  static async modifyTable(dbConn, modelName) {
    try {
      console.log(dbConn.connection.db())
      const collections = await dbConn.connection
        .db()
        .listCollections()
        .toArray()
      console.log(collections)
      // const db = dbConn.db(modelName)
      // const collection = db.collection(modelName)
      // const collectionExists = await collection.countDocuments()

      // if (collectionExists === 0) {
      //   await collection.createIndex({
      //     _id: 1,
      //   })
      // }

      return true
    } catch (err) {
      return { err }
    }
  }
}
