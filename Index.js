import dotenv from 'dotenv'

import NIDB from './Node-Identity-DB/NIDB.js'

// Load config
dotenv.config()

let DBconnections = {}

DBconnections['users'] = {
  dbid: await NIDB.useDatabase(
    'MongoDB',
    {
      mongoURI: process.env.MONGO_URI,
    },
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, dbConn) => {
      if (!err && dbConn) {
        console.log(
          `MongoDB '${dbConn.DBconnID}' connected on host '${dbConn.connection.host}' successfully!`
        )
      } else {
        console.log(err)
      }
    }
  ),
}
// DBconnections['items'] = { dbid: NIDB.useDatabase('mysql', 'mysql') }
// DBconnections['cart'] = { dbid: NIDB.useDatabase('mssql', 'mssql') }
// DBconnections['data'] = { dbid: NIDB.useDatabase('postgres', 'postgres') }

// console.log(NIDB.databaseConnections)

await NIDB.closeConnections(null, (err, dbConnIDlist) => {
  if (!err && dbConnIDlist) {
    console.log(`Database connections closed!`, dbConnIDlist)
  } else {
    console.log(err)
  }
})

// console.log(NIDB.databaseConnections)
