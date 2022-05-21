export const allowedDBs = ['MONGODB', 'MYSQLDB', 'PGNATIVE']

const supportedDBFiles = {
  MONGODB: {
    managerFile: './Managers/MongoDBManager.js',
  },
  MYSQLDB: {
    managerFile: './Managers/MySql2DBManager.js',
  },
}

const importDBManager = async (dbType) => {
  const managerFile = await import(supportedDBFiles[dbType].managerFile)
  return managerFile.default
}

export default class {
  // static allowedDBs = ['MONGODB', 'MYSQLDB', 'PGNATIVE']

  static validateDBType = (dbType) => {
    return allowedDBs.includes(dbType)
  }

  static getDBManager = async (dbType) => {
    if (this.validateDBType(dbType)) {
      return await importDBManager(dbType)
    } else {
      return new Error('Unsupported DB type')
    }
  }
}
