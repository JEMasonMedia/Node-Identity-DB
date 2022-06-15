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

  raw = async dbConn_query => {
    try {
      return await this.databaseConnections[dbConn_query.whichConnection].connectionManager.raw(this.databaseConnections[dbConn_query.whichConnection].connection, dbConn_query.query)
    } catch (err) {
      return { err }
    }
  }

  tableExists = async modelArgs => {
    try {
      const [connectionName, modelName] = this.#parseNames(modelArgs.model)
      return await this.databaseConnections[connectionName].connectionManager.tableExists(this.databaseConnections[connectionName].connection, this.databaseConnections[connectionName].models[modelName])
    } catch (err) {
      return { err }
    }
  }

  createTable = async modelArgs => {
    try {
      const [connectionName, modelName] = this.#parseNames(modelArgs.model)
      let res = await this.tableExists(modelArgs)
      if (res.err) return res
      if (res) return { err: 'Table already exists' }

      return await this.databaseConnections[connectionName].connectionManager.createTable(this.databaseConnections[connectionName].connection, this.databaseConnections[connectionName].models[modelName])
    } catch (err) {
      return { err }
    }
  }

  renameField = async (modelArgs, oldNewName) => {
    try {
      const [connectionName, modelName] = this.#parseNames(modelArgs.model)
      return await this.databaseConnections[connectionName].connectionManager.renameField(this.databaseConnections[connectionName].connection, this.databaseConnections[connectionName].models[modelName], oldNewName)
    } catch (err) {
      return { err }
    }
  }

  alterTable = async modelArgs => {
    try {
      const [connectionName, modelName] = this.#parseNames(modelArgs.model)
      let res = await this.tableExists(modelArgs)
      if (res.err) return res
      if (!res) return { err: 'Table does not exist' }

      let preserveData = modelArgs.preserveData === false ? false : true
      return await this.databaseConnections[connectionName].connectionManager.alterTable(this.databaseConnections[connectionName].connection, this.databaseConnections[connectionName].models[modelName], preserveData)
    } catch (err) {
      return { err }
    }
  }

  #parseNames = dotNotation => {
    return dotNotation.split('.')
  }
}
