import dotenv from 'dotenv'
// Load config
dotenv.config()
import NIDB from './Node-Identity-DB/NIDB.js'

const DBconnections = {}

DBconnections['users'] = {
  dbId: await NIDB.useDatabase(
    'users',
    'MONGODB',
    {
      host: process.env.MONGO_HOST,
      port: process.env.MONGO_PORT,
      database: process.env.MONGO_DATABASE,
      // user: process.env.MONGO_USER,
      // password: process.env.MONGO_PASSWORD,
      dbExtraConfig: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
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

DBconnections['items'] = {
  dbId: await NIDB.useDatabase(
    'items',
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

export default DBconnections
