const supportedDBFiles = {
  MONGODB: {
    managerFile: './Managers/MongoDBManager.js',
  },
  MYSQLDB: {
    managerFile: './Managers/MySql2DBManager.js',
  },
}

const importManager = async dbType => {
  const managerFile = await import(supportedDBFiles[dbType].managerFile)
  return managerFile.default
}

export default class {
  static allowedDBs = Object.keys(supportedDBFiles)

  static validateDBType = dbType => {
    return this.allowedDBs.includes(dbType)
  }

  static getDBManager = async dbType => {
    if (this.validateDBType(dbType)) {
      return new (await importManager(dbType))()
    } else {
      return new Error('Unsupported DB type')
    }
  }
}
