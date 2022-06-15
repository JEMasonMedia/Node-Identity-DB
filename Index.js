import wtf from 'wtfnode'
import './ancillaryImports.js'
import NIDB from './Node-Identity-DB/NIDB.js'
import DBconnections from './DBconnections.js'
import Models from './Models.js'

// import { Users, Items } from './seedData/seedData.js'

// console.log(Users, Items)

let dbConnections = new NIDB()

// open connections
await dbConnections.useDatabase(DBconnections['users'])
await dbConnections.useDatabase(DBconnections['items'])

// load models
dbConnections.useModel(Models['users'])
dbConnections.useModel(Models['items'])
// dbConnections.useModel(Models['users_test'])

// notify fully initialized
dbConnections.onInitialized((err, dbConns, models) => {
  if (err) {
    console.log(err)
  } else {
    if (dbConns?.length) {
      console.log(`These database connections have been established:`.red, dbConns)
      console.log(`These models have been established:`.cyan, models)
    } else {
      console.log(`No database connections have been established.`.red)
      console.log(`No models have been established.`.cyan)
    }
  }
})

// testing

// console.log(dbConnections)
// console.log(dbConnections.queryBuilder().select())

let res

res = await dbConnections.queryBuilder().raw({
  model: 'users.users',
  query: [{ city: 'London' }, { first_name: 1, _id: 0 }],
})
console.log('users\n', res)

// res = await dbConnections
//   .queryBuilder()
//   .select()
//   .from('users.users')
//   .where()
//   .execute()
// console.log('users')
// console.log(res)

// res = await dbConnections
//   .queryBuilder()
//   .select(['name'])
//   .from('items.items')
//   .where({
//     name: 'bread',
//   })
//   .execute()
// console.log('items')
// console.log(res)

// close connections
await dbConnections.closeConnections(null, (err, dbList) => {
  if (!err && dbList) {
    console.log(`Database connections closed:`.blue, dbList)
  } else {
    console.log(err)
  }
})

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// await dbConnections.useDatabases([
//   DBconnections['users'],
//   DBconnections['items'],
// ])
// dbConnections.useModels([Models['users'], Models['items']])

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

// res = await dbConnections.queryBuilder().tableExists({
//   whichConnection: 'items',
//   modelName: 'items',
// })
// console.log('items', res)

// if (!res) {
//   res = await dbConnections.queryBuilder().createTable({
//     whichConnection: 'items',
//     modelName: 'items',
//   })
//   console.log('items', res)
// }

// res = await dbConnections.queryBuilder().tableExists({
//   whichConnection: 'items',
//   modelName: 'users_test',
// })
// console.log('users_test', res)

// if (!res) {
//   res = await dbConnections.queryBuilder().createTable({
//     whichConnection: 'items',
//     modelName: 'users_test',
//   })
//   console.log('users_test', res)
// }

// res = await dbConnections.queryBuilder().renameField(
//   {
//     whichConnection: 'items',
//     modelName: 'items',
//   },
//   {
//     oldFieldName: 'item_name',
//     newFieldName: 'name',
//   }
// )
// console.log('items', res)

// usable state needs work
// res = await dbConnections.queryBuilder().alterTable({
//   whichConnection: 'items',
//   modelName: 'items',
//   preserveData: false,
// })
// console.log('items', res)

// instantiated dot notation for model direction
// usable state needs work
// res = await dbConnections.queryBuilder().alterTable({
//   model: 'items.items',
//   preserveData: false,
// })
// console.log('items', res)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// setTimeout(async () => {
//   if (dbConnections.hasActiveConnections()) {
//     await dbConnections.closeConnections(null, (err, dbList) => {
//       if (!err && dbList) {
//         console.log(`Database connections closed:`.blue, dbList)
//       } else {
//         console.log(err)
//       }
//     })
//   }
// }, 3000)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const user = DBconnections['users'].select('*').where({ id: 1 }).first()
// const item = DBconnections['items'].select('*').where({ id: 1 }).first()

// console.log(NIDB.databaseConnections['users'].models['users'].model.getModel())
// console.log(NIDB.databaseConnections['items'].models['items'].model.getModel())

// testing closed connections
// setTimeout(async () => {
//   wtf.dump()
// }, 4000)
