import supportedDBs from '../supportedDBs/supportedDBs.js'

export default class connectionManager {
  #getDBManager = async () => {
    if (this.connectionManager === null)
      this.connectionManager = await supportedDBs.getDBManager(
        this.databaseType
      )
  }

  connectDB = async () => {
    try {
      await this.#getDBManager()

      this.connection = await this.connectionManager.connectDB(
        this.connectionConfig,
        this.additionalConfig
      )
      return this
    } catch (error) {
      return { err: 'Error connecting to the DB', error }
    }
  }

  disconnectDB = async () => {
    try {
      await this.#getDBManager()

      await this.connectionManager.disconnectDB(this.connection)
      return true
    } catch (error) {
      return { err: 'Error closing the connection', error }
    }
  }
}
