import helpers from '../helpers/helpers.js'
import createQuery from './createQuery.js'

export default class queryBuilder {
  constructor() {
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
    this.createQuery = new createQuery()
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

      let query = this.createQuery.createTable(
        this.databaseConnections[dbConn_table.whichConnection].databaseType,
        this.databaseConnections[dbConn_table.whichConnection].models[
          dbConn_table.modelName
        ]
      )

      return await this.databaseConnections[
        dbConn_table.whichConnection
      ].connectionManager.createTable(
        this.databaseConnections[dbConn_table.whichConnection].connection,
        this.databaseConnections[dbConn_table.whichConnection].models[
          dbConn_table.modelName
        ],
        query
      )
    } catch (err) {
      return { err }
    }
  }

  alterTable = () => {
    const query = new queryBuilder()
    query.query.createTable = model
    return query
  }
}
