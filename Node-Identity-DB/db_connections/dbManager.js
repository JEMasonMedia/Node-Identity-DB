import MongoDBManager from './supportedDBs/MongoDBManager.js'
import MySql2DBManager from './supportedDBs/MySql2DBManager.js'

const supportedDBs = {}

supportedDBs['MONGODB'] = { manager: MongoDBManager }
supportedDBs['MYSQLDB'] = { manager: MySql2DBManager }

const dbManager = {
  connectDB: async (databaseType, connectionConfig, additionalConfig) => {
    databaseType =
      typeof databaseType == 'string' && databaseType !== ''
        ? databaseType
        : false

    if (databaseType) {
      try {
        if (supportedDBs[databaseType]) {
          return await supportedDBs[databaseType].manager.connectDB(
            connectionConfig,
            additionalConfig
          )
        } else {
          return { err: 'Unsupported database type' }
        }
      } catch (err) {
        return { err: 'Error connecting to the DB', error }
      }
    } else {
      return { err: 'Unsupported database type' }
    }
  },
  closeConnections: async (databaseType, dbConn) => {
    databaseType =
      typeof databaseType == 'string' && databaseType !== ''
        ? databaseType
        : false

    if (databaseType) {
      try {
        if (supportedDBs[databaseType]) {
          return await supportedDBs[databaseType].manager.disconnectDB(dbConn)
        } else {
          return { err: 'Unsupported database type' }
        }
      } catch (error) {
        return { err: 'Error closing the connection', error }
      }
    } else {
      return { err: 'Unsupported database type' }
    }
  },
}

export default dbManager
