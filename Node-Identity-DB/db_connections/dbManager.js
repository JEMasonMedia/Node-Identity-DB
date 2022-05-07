import supportedDBs from '../supportedDBs/supportedDBs.js'

export default class dbManager {
  static connectDB = async (
    databaseType,
    connectionConfig,
    additionalConfig
  ) => {
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

  static disconnectDB = async (databaseType, dbConn) => {
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

  static validateDBType = async (databaseType) => {
    return supportedDBs.validateDBType(databaseType)
  }

  static modifyTable = async (databaseType, dbConn, modelName) => {
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
