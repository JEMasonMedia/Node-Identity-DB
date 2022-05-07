import './ancillaryImports.js'
import NIDB from './Node-Identity-DB/NIDB.js'
import modelManager from './Node-Identity-DB/model_conversions/modelManager.js'
import DBconnections from './DBconnections.js'
import Models from './Models.js'

const init = async () => {
  // establish database connections
  const dbConnections = new NIDB()
  await dbConnections.useDatabase(
    DBconnections['users'],
    DBconnections.callBack
  )
  // await dbConnections.useDatabase(
  //   DBconnections['items'],
  //   DBconnections.callBack
  // )
  // connections['users'] = await NIDB.useDatabase(DBconnections['users'])
  // await NIDB.useDatabase(DBconnections['items'])

  // establish model connections
  // arguments: model
  await dbConnections.useModel(Models['users'], Models.callBack)
  // await NIDB.useModel(modelConnections['items'])

  await modelManager.modifyTable(
    dbConnections.databaseConnections['users'],
    'users',
    (err, model) => {
      if (!err && model) {
        console.log(
          `The collection: '${model.modelName}', on connection: '${model.connectionName}', was modified successfully!`
            .magenta
        )
      } else {
        console.log(err)
      }
    }
  )

  // await modelManager.modifyTable(
  //   NIDB.databaseConnections['items'],
  //   modelConnections['items'].modelName,
  //   (err, dbConn) => {
  //     if (!err && dbConn) {
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

  await dbConnections.closeConnections(null, (err, dbList) => {
    if (!err && dbList) {
      console.log(`Database connections closed:`.blue, dbList)
    } else {
      console.log(err)
    }
  })

  // console.log(NIDB.databaseConnections)
}

init()
