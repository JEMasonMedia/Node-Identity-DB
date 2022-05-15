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

import helpers from './helpers/helpers.js'
import connectionManager from './db_connections/connectionManager.js'
import modelManager from './model_conversions/modelManager.js'
import connection from './db_connections/connection.js'

export default class NIDB {
  constructor() {
    this.databaseConnections = {}
    this.loadedConnectionManagers = false
    this.loadedDatabases = false
  }

  useDbTypes = (requiredDBtypes) => {
    try {
      this.connectionManager = new connectionManager(requiredDBtypes)
      this.connectionManager
        .init()
        .then(() => {
          console.log(
            `Loaded connection managers for: ${requiredDBtypes}`.yellow
          )
          this.loadedConnectionManagers = true
          return this
        })
        .catch((err) => {
          console.log(err)
          return false
        })

      return this
    } catch (err) {
      return false
    }
  }

  useDatabases = (dbConnections, callBack) => {
    dbConnections.forEach((dbConnection) => {
      this.useDatabase(dbConnection, callBack)
    })
    return this
  }

  useDatabase = (
    { connectionName, databaseType, connectionConfig, additionalConfig },
    callBack = false
  ) => {
    if (connectionName && databaseType && connectionConfig) {
      try {
        this.databaseConnections = {
          ...this.databaseConnections,
          [`${connectionName}`]: new connection(
            connectionName,
            databaseType,
            connectionConfig,
            additionalConfig
          ),
        }
        helpers
          .waitFor((_) => this.loadedConnectionManagers === true)
          .then((_) => {
            this.connectionManager
              .connectDB(databaseType, connectionConfig, additionalConfig)
              .then((client) => {
                if (client.err) {
                  delete this.databaseConnections[connectionName]
                  if (callBack) callBack(client)
                } else {
                  this.databaseConnections[connectionName].connection = client
                  this.databaseConnections[connectionName].isConnected = true

                  // this.loadedDatabases = true
                  if (callBack)
                    callBack(null, this.databaseConnections[connectionName])
                }

                return this
              })
          })
          .catch(() => {
            if (callBack) callBack({ err: 'Invalid arguments' })
          })
      } catch (err) {
        if (callBack) callBack({ err: 'Invalid arguments' })
      }
    } else {
      if (callBack) callBack({ err: 'Invalid arguments' })
    }
    return this
  }

  useModels = (models, callback) => {
    models.forEach((model) => {
      this.useModel(model, callback)
    })
    return this
  }

  useModel = (
    { connectionName, modelName, model, additionalConfig },
    callBack = false
  ) => {
    try {
      if (connectionName && modelName && model) {
        helpers
          .waitFor(
            (_) => this.databaseConnections[connectionName].isConnected === true
          )
          .then((_) => {
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

                if (callBack)
                  callBack(
                    null,
                    this.databaseConnections[connectionName].models[modelName]
                  )
              } else {
                if (callBack) callBack({ err })
              }
            })
          })
      } else {
        if (callBack) callBack({ err: 'Invalid arguments' })
      }
    } catch (err) {
      if (callBack) callBack({ err })
    }
    return this
  }

  onInitialized = (timeOut, callBack) => {
    const dbConns = Object.keys(this.databaseConnections)
    let models = []
    let timeout = Date.now()

    try {
      if (dbConns.length > 0) {
        helpers
          .waitFor((_) => {
            let allSet = null
            dbConns.forEach((dbConn) => {
              if (allSet === false) {
                allSet = false
              } else {
                if (this.databaseConnections[dbConn].isConnected === true) {
                  allSet = true
                } else {
                  allSet = false
                }
              }
            })

            let t = Date.now() - timeout
            if (t > timeOut) {
              throw new Error('Timeout')
            }
            return allSet
          })
          .then((_) => {
            dbConns.forEach((dbConn) => {
              models = [
                ...models,
                ...Object.keys(this.databaseConnections[dbConn].models),
              ]
            })
            callBack(null, dbConns, models)
          })
          .catch((err) => {
            if (err === 'Timeout') callBack({ err: 'Timeout' })
            callBack({ err })
          })
      } else {
        callBack({ err: 'No database connections initialized' })
      }
    } catch (err) {
      callBack({ err })
    }

    return this
  }

  createStore = (config) => {}

  isConnected = (connectionName) => {
    if (connectionName) {
      return this.databaseConnections[connectionName].isConnected
    } else {
      return false
    }
  }

  hasActiveConnections = () => {
    const dbConns = Object.keys(this.databaseConnections)
    let timeout = Date.now()

    try {
      if (dbConns.length > 0) {
        helpers
          .waitFor((_) => {
            let allSet = null
            dbConns.forEach((dbConn) => {
              if (allSet === false) {
                allSet = false
              } else {
                if (this.databaseConnections[dbConn].isConnected === true) {
                  allSet = true
                } else {
                  allSet = false
                }
              }
            })

            let t = Date.now() - timeout
            if (t > 5000) {
              throw new Error('Timeout')
            }
            return allSet
          })
          .then((_) => {
            return true
          })
          .catch(() => {
            return false
          })
      } else {
        return false
      }
    } catch (err) {
      return false
    }
  }

  closeConnections = (dbs, callBack = false) => {
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
        results = this.connectionManager
          .disconnectDB(
            this.databaseConnections[list[i]].databaseType,
            this.databaseConnections[list[i]]
          )
          .then(() => {
            if (results?.err)
              errors.push({ connectionName: list[i], err: results.err })
          })
          .catch((err) => {
            errors.push({ connectionName: list[i], err: err })
          })
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
