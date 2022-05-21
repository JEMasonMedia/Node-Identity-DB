import supportedDBs from '../supportedDBs/supportedDBs.js'

export default class connectionManager {
  connectDB = async () => {
    try {
      if (!this.connectionManager) {
        const CM = await supportedDBs.getDBManager(this.databaseType)
        this.connectionManager = CM
      }

      this.connection = await this.connectionManager.connectDB(
        this.connectionConfig,
        this.additionalConfig
      )
      return this
    } catch (error) {
      return { err: 'Error connecting to the DB', error }
    }
  }

  disconnectDB = async () => {
    try {
      if (!this.connectionManager) {
        this.connectionManager = await supportedDBs.getDBManager(
          this.databaseType
        )
      }

      await this.connectionManager.disconnectDB(this.connection)
      return true
    } catch (error) {
      return { err: 'Error closing the connection', error }
    }
  }

  // validateDBType = (databaseType) => {
  //   return supportedDBs.validateDBType(databaseType)
  // }

  // createModifyTable = async (databaseType, dbConn, modelName) => {
  //   databaseType = supportedDBs.validateDBType(databaseType)
  //     ? databaseType
  //     : false

  //   if (databaseType) {
  //     try {
  //       supportedDBs.createModifyTable(dbConn, modelName)
  //       // const t = await supportedDBs.getDBManager(databaseType)
  //       // return await t.createModifyTable(dbConn, modelName)
  //       // [
  //       //   databaseType
  //       // ].connectionManager.createModifyTable(dbConn, modelName)
  //     } catch (error) {
  //       return { err: 'Error modifying table', error }
  //     }
  //   } else {
  //     return { err: 'Unsupported database type' }
  //   }
  // }
}
