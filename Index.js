import NIDB from './Node-Identity-DB/NIDB.js'
import './DCconnections.js'
import Models from './Models.js'

NIDB.useModel('users', 'users', Models['users'])
NIDB.useModel('items', 'items', Models['items'])

// const user = DBconnections['users'].select('*').where({ id: 1 }).first()
// const item = DBconnections['items'].select('*').where({ id: 1 }).first()

console.log(NIDB.databaseConnections['users'].models['users'].model.getModel())
console.log(NIDB.databaseConnections['items'].models['items'].model.getModel())

NIDB.closeConnections(null, (err, dbList) => {
  if (!err && dbList) {
    console.log(`Database connections closed:`, dbList)
  } else {
    console.log(err)
  }
})

// console.log(NIDB.databaseConnections)
