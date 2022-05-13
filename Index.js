import './ancillaryImports.js'
import NIDB from './Node-Identity-DB/NIDB.js'
import modelManager from './Node-Identity-DB/model_conversions/modelManager.js'
import DBconnections from './DBconnections.js'
import Models from './Models.js'

const dbConnections = new NIDB()

dbConnections
  .useDbTypes(['MONGODB', 'MYSQLDB'])
  .useDatabase(DBconnections['users'])
  .useModel(Models['users'])
  .useDatabase(DBconnections['items'])
  .useModel(Models['items'])
  .onInitialized(5000, (err, dbConns, models) => {
    if (err) {
      console.log(err)
    } else {
      console.log(
        `The database connections: [${dbConns}], have been established.`.red
      )
      console.log(`The models: [${models}], have been instantiated.`.cyan)
    }
  })

// dbConnections
//   .useDatabases(
//     [DBconnections['users'], DBconnections['items']],
//     DBconnections.callBack
//   )
//   .useModels([Models['users'], Models['items']], Models.callBack)

// dbConnections
// .useDatabase(DBconnections['users'], DBconnections.callBack)
// .useDatabase(DBconnections['items'], DBconnections.callBack)
// .useModel(Models['users'], Models.callBack)
// .useModel(Models['items'], Models.callBack)

// dbConnections
//   .useDatabase(DBconnections['users'], DBconnections.callBack)
//   .useModel(Models['users'], Models.callBack)
// dbConnections
//   .useDatabase(DBconnections['items'], DBconnections.callBack)
//   .useModel(Models['items'], Models.callBack)

// dbConnections.useModel(Models['users'], Models.callBack)
// dbConnections.useModel(Models['items'], Models.callBack)

let test = dbConnections.hasActiveConnections()

if (test) {
  dbConnections.closeConnections(null, (err, dbList) => {
    if (!err && dbList) {
      console.log(`Database connections closed:`.blue, dbList)
    } else {
      console.log(err)
    }
  })
}

//.then(async (res) => {
// if (!res) {
//   console.log('Error initializing NIDB')
// } else {
//   console.log('NIDB initialized')
//   await dbConnections.useDatabase(
//     DBconnections['users'],
//     DBconnections.callBack
//   )
// await dbConnections.useDatabase(
//   DBconnections['items'],
//   DBconnections.callBack
// )

// await dbConnections.closeConnections(null, (err, dbList) => {
//   if (!err && dbList) {
//     console.log(`Database connections closed:`.blue, dbList)
//   } else {
//     console.log(err)
//   }
// })
// }
// })

// const init = async () => {
// establish database connections

// if (dbConnections.init() !== true) {
//   console.log('Error initializing NIDB')
// }

// await dbConnections.useDatabases(
//   [DBconnections['users'], DBconnections['items']],
//   DBconnections.callBack
// )

// connections['users'] = await NIDB.useDatabase(DBconnections['users'])
// await NIDB.useDatabase(DBconnections['items'])

// establish model connections
// arguments: model
// dbConnections.useModels([Models['users'], Models['items']], Models.callBack)

// await modelManager.createModifyTable(
//   dbConnections.databaseConnections['users'],
//   'users',
//   (err, model) => {
//     if (!err && model) {
//       console.log(
//         `The collection: '${model.modelName}', on connection: '${model.connectionName}', was modified successfully!`
//           .magenta
//       )
//     } else {
//       console.log(err)
//     }
//   }
// )

// await modelManager.createModifyTable(
//   dbConnections.databaseConnections['items'],
//   'items',
//   (err, model) => {
//     if (!err && model) {
//       console.log(
//         `The collection: '${model.modelName}', on connection: '${model.connectionName}', was modified successfully!`
//           .magenta
//       )
//     } else {
//       console.log(err)
//     }
//   }
// )

// const user = DBconnections['users'].select('*').where({ id: 1 }).first()
// const item = DBconnections['items'].select('*').where({ id: 1 }).first()

// console.log(NIDB.databaseConnections['users'].models['users'].model.getModel())
// console.log(NIDB.databaseConnections['items'].models['items'].model.getModel())

// await dbConnections.closeConnections(null, (err, dbList) => {
//   if (!err && dbList) {
//     console.log(`Database connections closed:`.blue, dbList)
//   } else {
//     console.log(err)
//   }
// })

// console.log(NIDB.databaseConnections)
// }

// init()
