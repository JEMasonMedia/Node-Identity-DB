import supportedDBs from '../supportedDBs/supportedDBs.js'

export default class dbManager {
  static async connectDB(databaseType, connectionConfig, additionalConfig) {
    databaseType = dbManager.validateDBType(databaseType) ? databaseType : false

    if (databaseType) {
      try {
        return await supportedDBs[databaseType].connectionManager.connectDB(
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

  static async disconnectDB(databaseType, dbConn) {
    databaseType = dbManager.validateDBType(databaseType) ? databaseType : false

    if (databaseType) {
      try {
        return await supportedDBs[databaseType].connectionManager.disconnectDB(
          dbConn
        )
      } catch (error) {
        return { err: 'Error closing the connection', error }
      }
    } else {
      return { err: 'Unsupported database type' }
    }
  }

  static validateDBType(databaseType) {
    return supportedDBs.validateDBType(databaseType)
  }

  static async modifyTable(databaseType, dbConn, modelName) {
    databaseType = dbManager.validateDBType(databaseType) ? databaseType : false

    if (databaseType) {
      try {
        return await supportedDBs[databaseType].connectionManager.modifyTable(
          dbConn,
          modelName
        )
      } catch (error) {
        return { err: 'Error modifying table', error }
      }
    } else {
      return { err: 'Unsupported database type' }
    }
  }
}
