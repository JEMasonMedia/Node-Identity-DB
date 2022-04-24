import NIDB from './Node-Identity-DB/NIDB.js'
import DBconnections from './DCconnections.js'
import Models from './Models.js'

NIDB.useModel(DBconnections['users'].dbId, Models['users'])
NIDB.useModel(DBconnections['items'].dbId, Models['items'])

// const user = DBconnections['users'].select('*').where({ id: 1 }).first()
// const item = DBconnections['items'].select('*').where({ id: 1 }).first()

NIDB.closeConnections(null, (err, dbConnIDlist) => {
  if (!err && dbConnIDlist) {
    console.log(`Database connections closed!`, dbConnIDlist)
  } else {
    console.log(err)
  }
})

console.log(NIDB.databaseConnections)
