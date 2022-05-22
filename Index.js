import wtf from 'wtfnode'
import './ancillaryImports.js'
import NIDB from './Node-Identity-DB/NIDB.js'
import DBconnections from './DBconnections.js'
import Models from './Models.js'

let dbConnections = new NIDB()

const setupConnections = async () => {
  await dbConnections.useDatabase(DBconnections['users'])
  dbConnections.useModel(Models['users'])
  await dbConnections.useDatabase(DBconnections['items'])
  dbConnections.useModel(Models['items'])

  // await dbConnections.useDatabases([
  //   DBconnections['users'],
  //   DBconnections['items'],
  // ])
  // dbConnections.useModels([Models['users'], Models['items']])

  dbConnections.onInitialized((err, dbConns, models) => {
    if (err) {
      console.log(err)
    } else {
      if (dbConns?.length) {
        console.log(
          `These database connections have been established: `.red,
          dbConns
        )
        console.log(`These models have been established: `.cyan, models)
      } else {
        console.log(`No database connections have been established.`.red)
        console.log(`No models have been established.`.cyan)
      }
    }
  })

  // console.log(dbConnections)
  // console.log(dbConnections.queryBuilder().select())

  let res

  // res = await dbConnections.queryBuilder().tableExists({
  //   whichConnection: 'users',
  //   modelName: 'users',
  // })
  // console.log('users', res)

  // if (!res) {
  //   res = await dbConnections.queryBuilder().createTable({
  //     whichConnection: 'users',
  //     modelName: 'users',
  //   })
  //   console.log('creation users', res)
  // }

  res = await dbConnections.queryBuilder().tableExists({
    whichConnection: 'items',
    modelName: 'items',
  })
  console.log('items', res)

  if (!res) {
    res = await dbConnections.queryBuilder().createTable({
      whichConnection: 'items',
      modelName: 'items',
    })
    console.log('items', res)
  }
}

await setupConnections()

// setTimeout(() => {
//   console.log(dbConnections)
// }, 1000)

setTimeout(async () => {
  if (dbConnections.hasActiveConnections()) {
    await dbConnections.closeConnections(null, (err, dbList) => {
      if (!err && dbList) {
        console.log(`Database connections closed:`.blue, dbList)
      } else {
        console.log(err)
      }
    })
  }
}, 3000)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const user = DBconnections['users'].select('*').where({ id: 1 }).first()
// const item = DBconnections['items'].select('*').where({ id: 1 }).first()

// console.log(NIDB.databaseConnections['users'].models['users'].model.getModel())
// console.log(NIDB.databaseConnections['items'].models['items'].model.getModel())

// testing closed connections
// setTimeout(async () => {
//   wtf.dump()
// }, 4000)
