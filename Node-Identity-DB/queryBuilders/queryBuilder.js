import helpers from '../helpers/helpers.js'

export default class queryBuilder {
  constructor(databaseConnections) {
    // this.where = null
    // this.orderBy = null
    // this.limit = null
    // this.offset = null
    // this.select = null
    // this.distinct = null
    // this.groupBy = null
    // this.having = null
    // this.join = null
    // this.union = null
    // this.intersect = null
    // this.except = null
    // this.createTable = null
    // this.alterTable = null
    // this.#createQuery = new createQuery()
    this.databaseConnections = databaseConnections
    return this
  }

  select = () => {
    return 'this.select'
  }

  raw = async (dbConn_table_query) => {
    // NOT IMPLEMENTED
    throw new Error('Not implemented')
    // try {
    //   return await this.databaseConnections[
    //     dbConn_table_query.whichConnection
    //   ].connectionManager.raw(
    //     this.databaseConnections[dbConn_table_query.whichConnection].connection,
    //     this.databaseConnections[dbConn_table_query.whichConnection].models[
    //       dbConn_table_query.modelName
    //     ],
    //     dbConn_table_query.query
    //   )
    // } catch (err) {
    //   return { err }
    // }
  }

  tableExists = async (dbConn_table) => {
    try {
      return await this.databaseConnections[
        dbConn_table.whichConnection
      ].connectionManager.tableExists(
        this.databaseConnections[dbConn_table.whichConnection].connection,
        this.databaseConnections[dbConn_table.whichConnection].models[
          dbConn_table.modelName
        ]
      )
    } catch (err) {
      return { err }
    }
  }

  createTable = async (dbConn_table) => {
    try {
      let res = await this.tableExists(dbConn_table)
      if (res.err) return res
      if (res) return { err: 'Table already exists' }

      return await this.databaseConnections[
        dbConn_table.whichConnection
      ].connectionManager.createTable(
        this.databaseConnections[dbConn_table.whichConnection].connection,
        this.databaseConnections[dbConn_table.whichConnection].models[
          dbConn_table.modelName
        ]
      )
    } catch (err) {
      return { err }
    }
  }

  alterTable = () => {
    // const query = new queryBuilder()
    // query.query.createTable = model
    // return query
  }
}
