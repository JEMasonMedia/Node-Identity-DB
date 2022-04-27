import NIDB from './Node-Identity-DB/NIDB.js'
import DBconnections from './DCconnections.js'
import Models from './Models.js'

NIDB.useModel('users', 'users', Models['users'])
// NIDB.useModel('items', 'items', Models['items'])

// const user = DBconnections['users'].select('*').where({ id: 1 }).first()
// const item = DBconnections['items'].select('*').where({ id: 1 }).first()

console.log(NIDB.databaseConnections['users'].models['users'].model.getModel())
// console.log(NIDB.databaseConnections['items'].models['items'])

NIDB.closeConnections(null, (err, dbConnIDlist) => {
  if (!err && dbConnIDlist) {
    console.log(`Database connections closed!`, dbConnIDlist)
  } else {
    console.log(err)
  }
})

// console.log(NIDB.databaseConnections)
