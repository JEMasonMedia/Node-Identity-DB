import MongoDBManager from './Managers/MongoDBManager.js'
import MySql2DBManager from './Managers/MySql2DBManager.js'
import PostgresDBManager from './Managers/PgNativeDBManager.js'

const supportedDBTypes = ['MONGODB', 'MYSQLDB', 'PGNATIVE']

const supportedDBs = {
  MONGODB: {
    connectionManager: MongoDBManager,
  },
  MYSQLDB: {
    connectionManager: MySql2DBManager,
  },
  validateDBType: (type) => {
    return supportedDBTypes.includes(type)
  },
  getDBManager: (dbType) => {
    return supportedDBs[dbType].connectionManager
  },
}

export default supportedDBs
