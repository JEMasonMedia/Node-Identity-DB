import manageMongo from './supportedDBs/Mongo.js'

const supportedDBs = {}

supportedDBs['MongoDB'] = { manageMongo }

const dbManager = {
  connectDB: async (databaseType, connectionConfig, additionalConfig) => {
    databaseType =
      typeof databaseType == 'string' && databaseType !== ''
        ? databaseType
        : false

    if (databaseType) {
      try {
        if (supportedDBs[databaseType]) {
          return await supportedDBs[databaseType].manageMongo.connectMongo(
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
          return await supportedDBs[databaseType].manageMongo.disconnectMongo(
            dbConn
          )
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
