const DBconnections = {
  users: {
    connectionName: 'users',
    databaseType: 'MONGODB',
    connectionConfig: {
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
    additionalConfig: {},
    callBack: (err, dbConn) => {
      if (!err && dbConn) {
        console.log(
          `The ${dbConn.databaseType} connection: '${dbConn.connectionName}', on host '${dbConn.connectionConfig.host}', has connected successfully!`
            .red
        )
      } else {
        console.log(err)
      }
    },
  },
  items: {
    connectionName: 'items',
    databaseType: 'MYSQLDB',
    connectionConfig: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
    additionalConfig: {},
    callBack: (err, dbConn) => {
      if (!err && dbConn) {
        console.log(
          `The ${dbConn.databaseType} connection: '${dbConn.connectionName}', on host '${dbConn.connectionConfig.host}', has connected successfully!`
            .red
        )
      } else {
        console.log(err)
      }
    },
  },
}

// DBconnections['items'] = { dbid: NIDB.useDatabase('mysql', 'mysql') }
// DBconnections['cart'] = { dbid: NIDB.useDatabase('mssql', 'mssql') }
// DBconnections['data'] = { dbid: NIDB.useDatabase('postgres', 'postgres') }

// console.log(NIDB.databaseConnections)

export default DBconnections
