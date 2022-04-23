import dotenv from 'dotenv'

import NIDB from './Node-Identity-DB/NIDB.js'

// Load config
dotenv.config()

let DBconnections = {}

DBconnections['users'] = {
  dbid: await NIDB.useDatabase(
    'MONGODB',
    {
      // mongoURI: process.env.MONGO_URI,
      host: process.env.MONGO_HOST,
      port: process.env.MONGO_PORT,
    },
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, dbConn) => {
      if (!err && dbConn) {
        console.log(
          `${dbConn.databaseType} '${dbConn.DBconnID}' connected on host '${dbConn.connectionConfig.host}' successfully!`
        )
      } else {
        console.log(err)
      }
    }
  ),
}

DBconnections['items'] = {
  dbid: await NIDB.useDatabase(
    'MYSQLDB',
    {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
    {},
    (err, dbConn) => {
      if (!err && dbConn) {
        console.log(
          `${dbConn.databaseType} '${dbConn.DBconnID}' connected on host '${dbConn.connectionConfig.host}' successfully!`
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

NIDB.closeConnections(null, (err, dbConnIDlist) => {
  if (!err && dbConnIDlist) {
    console.log(`Database connections closed!`, dbConnIDlist)
  } else {
    console.log(err)
  }
})

console.log(NIDB.databaseConnections)
