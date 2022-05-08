import queryBuilder from '../query_builders/queryBuilder.js'

export default class connection extends queryBuilder {
  constructor(
    connectionName,
    databaseType,
    connectionConfig,
    additionalConfig
  ) {
    super()
    this.connectionName = connectionName
    this.databaseType = databaseType
    this.connectionConfig = connectionConfig
    this.additionalConfig = additionalConfig
    this.connection = null
    this.models = {}
  }
}
