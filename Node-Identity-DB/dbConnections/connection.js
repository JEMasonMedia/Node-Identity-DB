import supportedDBs from '../supportedDBs/supportedDBs.js'

export default class connection {
  constructor(connectionName, databaseType, connectionConfig, additionalConfig) {
    this.connectionName = connectionName
    this.databaseType = databaseType
    this.connectionConfig = connectionConfig
    this.additionalConfig = additionalConfig
    this.connectionManager = null
    this.models = {}
    this.isConnected = false
  }

  #getDBManager = async () => {
    if (this.connectionManager === null) this.connectionManager = await supportedDBs.getDBManager(this.databaseType)
  }

  connectDB = async () => {
    try {
      await this.#getDBManager()
      await this.connectionManager.connectDB(this.connectionConfig, this.additionalConfig)
      return this
    } catch (error) {
      return { err: 'Error connecting to the DB', error }
    }
  }

  disconnectDB = async () => {
    try {
      await this.#getDBManager()
      await this.connectionManager.disconnectDB()
      return true
    } catch (error) {
      return { err: 'Error closing the connection', error }
    }
  }
}
