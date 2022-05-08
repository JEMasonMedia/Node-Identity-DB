/*
 * Main entry to Node-Identity-DB
 *
 * Purpose - establish use functions and exports for multiple database type connections
 *    * Utilizes Knex.js, Mongoose, and other existing, trusted libraries
 *    * Creates elasticity for Node-Identity and other applications database connections
 *
 * useDatabase() - arguments: 'string database type', 'connection string', 'optional additional config'
 *    * Multiple calls allow for multiple database type connections
 *    * Database ID's stored in databaseConnections object in order received
 *    * returns DBconnID or error
 *
 * useModel() - arguments: model object adhering to documented structure, 'optional additional config'
 *    * Creates a generic model pallette for SQL and NoSql database types
 *    * Allows for total congruency between SQL and NoSql database types
 *    * Allows for seamless transfers between SQL and NoSql database types
 *    * Allows for Key/Foreign Key relationships within NoSql database types
 *    * returns modelId or error
 *
 * createStore() - arguments: configuration object
 *    * Creates store for auth purposes similar to connect-mongo
 *    * Will be implemented later
 *
 * closeConnections() - arguments: 'optional database ID array'
 *    * Closes all or specified database connections
 */

// import helpers from './helpers/helpers.js'
import connectionManager from './db_connections/connectionManager.js'
import modelManager from './model_conversions/modelManager.js'
import connection from './db_connections/connection.js'

export default class NIDB {
  constructor() {
    this.databaseConnections = {}
  }

  useDatabases = async (dbConnections, callback) => {
    for (let i = 0; i < dbConnections.length; i++) {
      await this.useDatabase(dbConnections[i], callback)
    }
  }

  useDatabase = async (
    { connectionName, databaseType, connectionConfig, additionalConfig },
    callBack = false
  ) => {
    if (connectionName && databaseType && connectionConfig) {
      this.databaseConnections = {
        ...this.databaseConnections,
        [`${connectionName}`]: new connection(
          connectionName,
          databaseType,
          connectionConfig,
          additionalConfig
        ),
      }

      const client = await connectionManager.connectDB(
        databaseType,
        connectionConfig,
        additionalConfig
      )

      if (client.err) {
        delete this.databaseConnections[connectionName]
        if (callBack) callBack(client)
        return false
      } else {
        this.databaseConnections[connectionName].connection = client
        if (callBack) callBack(null, this.databaseConnections[connectionName])
        return true
      }
    } else {
      if (callBack) callBack({ err: 'Invalid arguments' })
      return false
    }
  }

  useModels = (models, callback) => {
    for (let i = 0; i < models.length; i++) {
      this.useModel(models[i], callback)
    }
  }

  useModel = (
    { connectionName, modelName, model, additionalConfig },
    callBack = false
  ) => {
    if (connectionName && modelName && model) {
      try {
        modelManager.validateModel(model, (err, valid) => {
          if (!err && valid) {
            this.databaseConnections[connectionName].models[modelName] =
              new modelManager(
                this.databaseConnections[connectionName].databaseType,
                modelName,
                connectionName,
                model,
                additionalConfig
              )
          } else {
            if (callBack) callBack({ err })
            return false
          }
        })
      } catch (err) {
        if (callBack) callBack({ err })
        return false
      } finally {
        if (callBack)
          callBack(
            null,
            this.databaseConnections[connectionName].models[modelName]
          )
        return true
      }
    } else {
      if (callBack) callBack({ err: 'Invalid arguments' })
      return false
    }
  }

  createStore = (config) => {}

  closeConnections = async (dbs, callBack = false) => {
    let list = []
    let results = null
    let errors = []

    try {
      if (dbs) {
        if (typeof dbs === 'string') {
          list.push(dbs)
        } else if (Array.isArray(dbs)) {
          list = dbs
        } else {
          if (callBack) callBack({ err: 'Invalid arguments' })
          else return false
        }
      } else {
        list = Object.keys(this.databaseConnections)
      }

      for (let i = 0; i < list.length; i++) {
        results = await connectionManager.disconnectDB(
          this.databaseConnections[list[i]].databaseType,
          this.databaseConnections[list[i]]
        )

        if (results?.err) {
          errors.push({ connectionName: list[i], err: results.err })
        }
      }

      if (errors.length > 0) {
        callBack(errors)
        if (callBack) callBack({ err: errors })
        return false
      } else {
        if (callBack) callBack(null, list)
        return true
      }
    } catch (err) {
      if (callBack) callBack({ err })
      return false
    }
  }
}
