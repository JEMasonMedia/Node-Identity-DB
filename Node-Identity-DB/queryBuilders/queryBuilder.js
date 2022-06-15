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
    this.query = {}
    return this
  }

  select = args => {
    const test = args !== undefined ? args : null
    this.query = {
      ...this.query,
      queryType: 'select',
      select: test,
    }
    return this
  }

  update = args => {
    this.query = {
      ...this.query,
      queryType: 'update',
      update: args !== undefined ? args : null,
    }
    return this
  }

  insert = args => {
    this.query = {
      ...this.query,
      queryType: 'insert',
      insert: args !== undefined ? args : null,
    }
    return this
  }

  delete = args => {
    this.query = {
      ...this.query,
      queryType: 'delete',
      delete: args !== undefined ? args : null,
    }
    return this
  }

  from = args => {
    this.query = {
      ...this.query,
      model: this.#parseNames(args),
    }
    return this
  }

  where = args => {
    this.query = {
      ...this.query,
      where: args !== undefined ? args : null,
    }
    return this
  }

  orderBy = (...args) => {
    this.query = {
      ...this.query,
      orderBy: args !== undefined ? args : null,
    }
    return this
  }

  limit = (...args) => {
    this.query = {
      ...this.query,
      limit: args !== undefined ? args : null,
    }
    return this
  }

  execute = async () => {
    try {
      // const { queryType, from, where, orderBy, limit, insert, update, delete, select } = this.query
      const res = this.databaseConnections[this.query.model.connectionName].connectionManager.prepareStatement(this.query)
      if (res.err) {
        throw res.err
      }
      return await this.databaseConnections[this.query.model.connectionName].connectionManager.executeStatement(res)
    } catch (err) {
      return { err }
    }
  }

  raw = async modelArgs => {
    try {
      modelArgs = { ...modelArgs, ...this.#parseNames(modelArgs.model) }
      return await this.databaseConnections[modelArgs.connectionName].connectionManager.raw(modelArgs)
    } catch (err) {
      return { err }
    }
  }

  tableExists = async modelArgs => {
    try {
      const { connectionName, modelName } = this.#parseNames(modelArgs.model)
      return await this.databaseConnections[connectionName].connectionManager.tableExists(this.databaseConnections[connectionName].models[modelName])
    } catch (err) {
      return { err }
    }
  }

  createTable = async modelArgs => {
    try {
      const { connectionName, modelName } = this.#parseNames(modelArgs.model)
      let res = await this.tableExists(modelArgs)
      if (res.err) return res
      if (res) return { err: 'Table already exists' }

      return await this.databaseConnections[connectionName].connectionManager.createTable(this.databaseConnections[connectionName].models[modelName])
    } catch (err) {
      return { err }
    }
  }

  renameField = async (modelArgs, oldNewName) => {
    try {
      const { connectionName, modelName } = this.#parseNames(modelArgs.model)
      return await this.databaseConnections[connectionName].connectionManager.renameField(this.databaseConnections[connectionName].models[modelName], oldNewName)
    } catch (err) {
      return { err }
    }
  }

  alterTable = async modelArgs => {
    try {
      const { connectionName, modelName } = this.#parseNames(modelArgs.model)
      let res = await this.tableExists(modelArgs)
      if (res.err) return res
      if (!res) return { err: 'Table does not exist' }

      let preserveData = modelArgs.preserveData === false ? false : true
      return await this.databaseConnections[connectionName].connectionManager.alterTable(this.databaseConnections[connectionName].models[modelName], preserveData)
    } catch (err) {
      return { err }
    }
  }

  #parseNames = dotNotation => {
    const [connectionName, modelName] = dotNotation.split('.')
    return { connectionName, modelName }
  }
}
