import MongoDBManager from './supportedDBs/MongoDBManager.js'
import MySql2DBManager from './supportedDBs/MySql2DBManager.js'

const supportedDBs = {}

supportedDBs['MONGODB'] = { manager: MongoDBManager }
supportedDBs['MYSQLDB'] = { manager: MySql2DBManager }

export default supportedDBs
