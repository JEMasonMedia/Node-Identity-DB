// import MongoDBManager from './Managers/MongoDBManager.js'
// import MySql2DBManager from './Managers/MySql2DBManager.js'

// import PostgresDBManager from './Managers/PgNativeDBManager.js'
// const PostgresDBManager = require('./Managers/PgNativeDBManager')

// () => {
//   const supportedDBs = {
//     MongoDB: MongoDBManager,
//     MySql2: MySql2DBManager,
//     // Postgres: PostgresDBManager
//   }
//   return supportedDBs
// }
// let MongoDBManager // from './Managers/MongoDBManager.js'
// let MySql2DBManager // from './Managers/MySql2DBManager.js'
// let PostgresDBManager
// let supportedDBTypes = ['MONGODB', 'MYSQLDB', 'PGNATIVE']
// let supportedDBs
// const test = async () => {
//   MongoDBManager = await import('./Managers/MongoDBManager.js')
//   MySql2DBManager = await import('./Managers/MySql2DBManager.js')
//   PostgresDBManager = await import('./Managers/PgNativeDBManager.js')
// }
// test()

// const supportedDBs = {
//   validateDBType: (type) => {
//     return supportedDBTypes.includes(type)
//   },
//   getDBManager: async (type) => {
//     switch (type) {
//       case 'MONGODB':
//         const MongoDBManager = await import('./Managers/MongoDBManager.js')
//         return MongoDBManager
//       case 'MYSQLDB':
//         const MySql2DBManager = await import('./Managers/MySql2DBManager.js')
//         return MySql2DBManager
//       // case 'PGNATIVE':
//       //   const PostgresDBManager = (
//       //     await import('./Managers/PostgresDBManager.js')
//       //   ).default
//       //   return PostgresDBManager
//       default:
//         return false
//     }
//     // return supportedDBs[dbType].connectionManager
//   },
// }

// ;(async () => {
//   console.log(await supportedDBs.getDBManager('MONGODB'))
// })()

// export default supportedDBs
// const supportedDBs = ['MONGODB', 'MYSQLDB', 'PGNATIVE']

// export default class {
//   #allowedDBs = []
//   dbTypes = []
//   supportedDBs = {}

//   constructor(requiredDBtypes) {
//     this.#allowedDBs = ['MONGODB', 'MYSQLDB', 'PGNATIVE']
//     this.dbTypes = this.#checkTypes(requiredDBtypes)

//     this.#getSupportedDBs()
//   }

//   static validateDBType = (type) => {
//     return this.dbTypes.includes(type)
//   }

//   static getDBManager = (type) => {
//     if (this.validateDBType(type)) {
//       return this.supportedDBs[type]
//     } else {
//       return new Error('Unsupported DB type')
//     }
//   }

//   #getSupportedDBs = () => {
//     for (let dbType of this.dbTypes) {
//       switch (dbType) {
//         case 'MONGODB':
//           import('./Managers/MongoDBManager.js').then((module) => {
//             this.supportedDBs[dbType] = module.default
//           })
//           break
//         case 'MYSQLDB':
//           import('./Managers/MySql2DBManager.js').then((module) => {
//             this.supportedDBs[dbType] = module.default
//           })
//         case 'PGNATIVE':
//           import('./Managers/PostgresDBManager.js').then((module) => {
//             this.supportedDBs[dbType] = module.default
//           })
//           break
//         default:
//           new Error('Unsupported DB type')
//       }
//     }
//   }

//   #checkTypes = (types) => {
//     return types.map((type) => {
//       return this.#allowedDBs.includes(type)
//         ? type
//         : new Error('Unsupported DB type')
//     })
//   }
// }

// const supportedDBTypes = ['MONGODB', 'MYSQLDB', 'PGNATIVE']

// const supportedDBs = {
//   MONGODB: {
//     connectionManager: MongoDBManager,
//   },
//   MYSQLDB: {
//     connectionManager: MySql2DBManager,
//   },
//   validateDBType: (type) => {
//     return supportedDBTypes.includes(type)
//   },
//   getDBManager: (dbType) => {
//     return supportedDBs[dbType].connectionManager
//   },
// }

// export default supportedDBs

// import { createRequire } from 'module'
// const Require = createRequire(import.meta.url)

// const MongoDBManager = null
// const MySql2DBManager = null

// const test = async () => {
//   MongoDBManager = (await import('./Managers/MongoDBManager.js')).default
//   MySql2DBManager = (await import('./Managers/MySql2DBManager.js')).default
//   import('./Managers/MongoDBManager.js').then((module) => {
//     console.log(module.default)
//     MongoDBManager = module.default
//     console.log(MongoDBManager)
//   })
//   import('./something.js').then((module) => {
//     // Use the module the way you want, as:
//     module.hi('Erick') // Named export
//     module.bye('Erick') // Named export
//     module.default() // Default export
//   })
//   const module = await import('./something.js')
//   module.hi('Erick')
//   console.log(first)

//   const { default: helloWorld } = await import('./something.js')
//   helloWorld()
// }
// ;(async () => {
//   await test()
// })()

let somethingIsTrue = true

const test = async () => {
  if (somethingIsTrue) {
    const module = await import('./something.js')

    // Use the module the way you want, as:
    module.default() // Default export

    const { bye } = await import('./something.js')
    bye('Erick')
  }
}

import helpers from '../helpers/helpers.js'

const supportedDBFiles = {
  MONGODB: {
    managerFile: './Managers/MongoDBManager.js',
  },
  MYSQLDB: {
    managerFile: './Managers/MySql2DBManager.js',
  },
}

const getSupportedDBs = async (dbTypes) => {
  let modules = []
  const supportedDBs = {}

  try {
    for (let dbType of dbTypes) {
      modules.push(import(supportedDBFiles[dbType].managerFile))
    }

    const modulesImported = await Promise.all(modules)
    for (let module of modulesImported) {
      supportedDBs[module.default.dbType] = module.default
    }
    // await helpers.asyncWait(1000)
    // console.log(supportedDBs)
    return supportedDBs
  } catch (error) {
    console.log(error)
  }
}

const checkTypes = (allowedTypes, types) => {
  return types.map((type) => {
    return allowedTypes.includes(type) ? type : new Error('Unsupported DB type')
  })
}

export default class {
  allowedDBs = []
  dbTypes = []
  supportedDBs = {}

  init = async (requiredDBtypes) => {
    this.allowedDBs = ['MONGODB', 'MYSQLDB', 'PGNATIVE']
    this.dbTypes = checkTypes(this.allowedDBs, requiredDBtypes)

    // await test()

    this.supportedDBs = await getSupportedDBs(this.dbTypes)
  }

  validateDBType = (dbType) => {
    return this.dbTypes.includes(dbType)
  }

  getDBManager = (dbType) => {
    if (this.validateDBType(dbType)) {
      return this.supportedDBs[dbType]
    } else {
      return new Error('Unsupported DB type')
    }
  }
}

// for (let dbType of dbTypes) {
// dbTypes.map(async (dbType) => {
//   module = await import(supportedDBFiles[dbType].managerFile)
//   supportedDBs[dbType] = module.default
// })
// switch (dbType) {
//   case 'dbType':
//     module = await import(supportedDBFiles[dbType].managerFile)
//     console.log(module.default)
//     supportedDBs[dbType] = module.default
//     break
//   default:
//     throw new Error('Unsupported DB type')
// }
// })

// switch (dbType) {
//   case 'MONGODB':
//     // def = await import('./Managers/MongoDBManager.js')
//     // supportedDBs[dbType] = new def.default

//     // def = await import('./Managers/MongoDBManager.js')
//     // supportedDBs[dbType] = new def.default()

//     // const { default: MongoDBManager } = await import(
//     //   './Managers/MongoDBManager.js'
//     // )
//     // supportedDBs[dbType] = new MongoDBManager()

//     import('./Managers/MongoDBManager.js')
//       .then((module) => {
//         supportedDBs[dbType] = module.default
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//     break
//   case 'MYSQLDB':
//     // def = await import('./Managers/MySql2DBManager.js')
//     // supportedDBs[dbType] = new def.default

//     // def = await import('./Managers/MySql2DBManager.js')
//     // supportedDBs[dbType] = new def.default()

//     // const { default: MySql2DBManager } = await import(
//     //   './Managers/MySql2DBManager.js'
//     // )
//     // supportedDBs[dbType] = new MySql2DBManager()

//     import('./Managers/MySql2DBManager.js')
//       .then((module) => {
//         supportedDBs[dbType] = module.default
//       })
//       .catch((err) => {
//         console.log(err)
//       })
//     break
//   // case 'PGNATIVE':
//   //   import('./Managers/PostgresDBManager.js').then((module) => {
//   //     supportedDBs[dbType] = module.default
//   //   })
//   //   break
//   default:
//     new Error('Unsupported DB type')
// }
