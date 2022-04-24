import MongoDBManager from './Managers/MongoDBManager.js'
import MySql2DBManager from './Managers/MySql2DBManager.js'

const supportedDBs = {}

supportedDBs['MONGODB'] = { manager: MongoDBManager }
supportedDBs['MYSQLDB'] = { manager: MySql2DBManager }

export default supportedDBs
