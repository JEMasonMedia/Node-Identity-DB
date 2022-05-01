import './ancillaryImports.js'
import NIDB from './Node-Identity-DB/NIDB.js'
import modelManager from './Node-Identity-DB/model_conversions/modelManager.js'
import DBconnections from './DBconnections.js'
import modelConnections from './Models.js'

// establish database connections
await NIDB.useDatabase(DBconnections['users'])
// await NIDB.useDatabase(DBconnections['items'])

// establish model connections
// arguments: model, modifyTable = false (default)
// if modifyTable is true, then the table will be modified to match the model
// modifyTable can be called directly off the modelManager class: see below
await NIDB.useModel(modelConnections['users'], true)
// await NIDB.useModel(modelConnections['items'], true)

// await modelManager.modifyTable(
//   NIDB.databaseConnections['users'],
//   modelConnections['users'].modelName,
//   (err, model) => {
//     if (!err && model) {
//       console.log(
//         `The collection: '${model.modelName}', on connection: '${model.connectionName}', was modified successfully!`
//           .purple
//       )
//     } else {
//       console.log(err)
//     }
//   }
// )

// await modelManager.modifyTable(
//   NIDB.databaseConnections['items'],
//   modelConnections['items'].modelName,
//   (err, dbConn) => {
//     if (!err && dbConn) {
//       console.log(
//         `The collection: '${model.modelName}', on connection: '${model.connectionName}', was modified successfully!`
//           .purple
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

NIDB.closeConnections(null, (err, dbList) => {
  if (!err && dbList) {
    console.log(`Database connections closed:`.blue, dbList)
  } else {
    console.log(err)
  }
})

// console.log(NIDB.databaseConnections)
