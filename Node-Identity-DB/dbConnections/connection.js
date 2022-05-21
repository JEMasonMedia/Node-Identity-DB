import connectionManager from './connectionManager.js'

export default class connection extends connectionManager {
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
    this.isConnected = false
  }
}
