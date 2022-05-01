import './ancillaryImports.js'
import NIDB from './Node-Identity-DB/NIDB.js'
import DBconnections from './DBconnections.js'
import modelConnections from './Models.js'

await NIDB.useDatabase(DBconnections['users'])
await NIDB.useDatabase(DBconnections['items'])

NIDB.useModel(modelConnections['users'])
NIDB.useModel(modelConnections['items'])

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
