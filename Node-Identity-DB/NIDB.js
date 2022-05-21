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
import queryBuilder from './queryBuilders/queryBuilder.js'
import connection from './dbConnections/connection.js'
import modelManager from './modelConversions/modelManager.js'

export default class NIDB extends queryBuilder {
  constructor() {
    super()
    this.databaseConnections = {}
    this.loadedConnectionManagers = false
    this.loadedDatabases = false
    return this
  }

  useDatabases = async (dbConnections, callBack) => {
    for (const dbConnection in dbConnections) {
      await this.useDatabase(dbConnections[dbConnection], callBack)
    }
    this.loadedDatabases = true
    return this
  }

  useDatabase = async (
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

        let res = await this.databaseConnections[connectionName].connectDB()
        // console.log(this.databaseConnections[connectionName])

        if (!res) {
          delete this.databaseConnections[connectionName]
          if (callBack) callBack(client)
        } else {
          this.databaseConnections[connectionName].isConnected = true
          if (callBack) callBack(null, this.databaseConnections[connectionName])
        }
      } catch (err) {
        if (callBack) callBack({ err: 'Invalid arguments' })
      }
    } else {
      if (callBack) callBack({ err: 'Invalid arguments' })
    }
    return this
  }

  useModels = (models, callBack) => {
    for (const model in models) {
      this.useModel(models[model], callBack)
    }
    return this
  }

  useModel = (
    { connectionName, modelName, model, additionalConfig },
    callBack = false
  ) => {
    try {
      if (connectionName && modelName && model) {
        this.databaseConnections[connectionName].models[modelName] =
          new modelManager(
            this.databaseConnections[connectionName].databaseType,
            modelName,
            connectionName,
            model,
            additionalConfig
          )
      } else {
        if (callBack) callBack({ err: 'Invalid arguments' })
      }
    } catch (err) {
      if (callBack) callBack({ err })
    }
    return this
  }

  onInitialized = async (callBack) => {
    const dbConns = Object.keys(this.databaseConnections)
    let models = []
    let allSet = null

    try {
      if (dbConns.length > 0) {
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
        dbConns.forEach((dbConn) => {
          models = [
            ...models,
            ...Object.keys(this.databaseConnections[dbConn].models),
          ]
        })
        callBack(null, dbConns, models)
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
    let allSet = null

    try {
      if (dbConns.length > 0) {
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
        return allSet
      } else {
        return false
      }
    } catch (err) {
      return false
    }
  }

  closeConnections = async (dbs, callBack = false) => {
    let list = []
    let res = null
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
        res = await this.databaseConnections[list[i]].disconnectDB()

        if (res?.err) errors.push({ connectionName: list[i], err: res.err })

        if (res) {
          this.databaseConnections[list[i]].isConnected = false
          delete this.databaseConnections[list[i]]
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
