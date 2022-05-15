import supportedDBs from '../supportedDBs/supportedDBs.js'

export default class connectionManager {
  constructor(requiredDBtypes) {
    // supportedDBs.init(requiredDBtypes)
    // this.supportedDBs = supportedDBs
    this.requiredDBtypes = requiredDBtypes
  }

  init = async () => {
    try {
      // await supportedDBs.init(this.requiredDBtypes)
      this.supportedDBs = new supportedDBs()

      return await this.supportedDBs.init(this.requiredDBtypes)
    } catch (err) {
      console.log(err)
      return { err }
    }
  }

  connectDB = async (databaseType, connectionConfig, additionalConfig) => {
    databaseType = this.supportedDBs.validateDBType(databaseType)
      ? databaseType
      : false

    if (databaseType) {
      try {
        // const connectionManager = await supportedDBs.getDBManager(databaseType)
        return await this.supportedDBs.getDBManager(databaseType).connectDB(
          // const t = await supportedDBs.getDBManager(databaseType)
          // return await t.connectionManager.connectDB(
          connectionConfig,
          additionalConfig
        )
      } catch (error) {
        return { err: 'Error connecting to the DB', error }
      }
    } else {
      return { err: 'Unsupported database type' }
    }
  }

  disconnectDB = async (databaseType, dbConn) => {
    databaseType = this.supportedDBs.validateDBType(databaseType)
      ? databaseType
      : false

    if (databaseType) {
      try {
        return await this.supportedDBs
          .getDBManager(databaseType)
          .disconnectDB(dbConn)
        // const t = await supportedDBs.getDBManager(databaseType)
        // return await t.connectionManager.disconnectDB(dbConn)
      } catch (error) {
        return { err: 'Error closing the connection', error }
      }
    } else {
      return { err: 'Unsupported database type' }
    }
  }

  validateDBType = async (databaseType) => {
    return this.supportedDBs.validateDBType(databaseType)
  }

  createModifyTable = async (databaseType, dbConn, modelName) => {
    databaseType = this.supportedDBs.validateDBType(databaseType)
      ? databaseType
      : false

    if (databaseType) {
      try {
        this.supportedDBs.createModifyTable(dbConn, modelName)
        // const t = await supportedDBs.getDBManager(databaseType)
        // return await t.createModifyTable(dbConn, modelName)
        // [
        //   databaseType
        // ].connectionManager.createModifyTable(dbConn, modelName)
      } catch (error) {
        return { err: 'Error modifying table', error }
      }
    } else {
      return { err: 'Unsupported database type' }
    }
  }
}
