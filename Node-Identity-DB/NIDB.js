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
import dbManager from './db_connections/dbManager.js'
import modelManager from './model_conversions/modelManager.js'

const NIDB = class {
  static useDatabase = async ({
    connectionName,
    databaseType,
    connectionConfig,
    additionalConfig,
    callBack,
  }) => {
    if (connectionName && databaseType && connectionConfig && callBack) {
      this.databaseConnections = {
        ...this.databaseConnections,
        [`${connectionName}`]: {
          connectionName,
          databaseType,
          connectionConfig,
          additionalConfig,
          connection: null,
          models: {},
        },
      }

      const client = await dbManager.connectDB(
        databaseType,
        connectionConfig,
        additionalConfig
      )

      if (client.err) {
        delete this.databaseConnections[connectionName]
        callBack(client)
      } else {
        this.databaseConnections[connectionName].connection = client
        callBack(null, this.databaseConnections[connectionName])
      }
    } else {
      callBack({ err: 'Invalid arguments' })
    }
  }

  static useModel = async (
    { connectionName, modelName, model, additionalConfig, callBack },
    modifyTable = false
  ) => {
    if (connectionName && modelName && model) {
      try {
        await modelManager.validateModel(model, async (err, valid) => {
          if (!err && valid) {
            this.databaseConnections[connectionName].models[modelName] =
              new modelManager(
                modelName,
                connectionName,
                model,
                additionalConfig
              )
            if (modifyTable) {
              try {
                await modelManager.modifyTable(
                  this.databaseConnections[connectionName],
                  modelName,
                  (err, model) => {
                    if (!err && model) {
                      console.log(
                        `The collection: '${model.modelName}', on connection: '${model.connectionName}', was modified successfully!`
                          .magenta
                      )
                    } else {
                      callBack(err)
                    }
                  }
                )
              } catch (err) {
                callBack({ err })
              }
            }
          } else {
            callBack({ err })
          }
        })
      } catch (err) {
        callBack({ err })
      } finally {
        callBack(
          null,
          this.databaseConnections[connectionName].models[modelName]
        )
      }
    } else {
      callBack({ err: 'Invalid arguments' })
    }
  }

  static createStore = (config) => {}

  static closeConnections = (dbs, callBack) => {
    let list = []
    let errors = []

    try {
      if (!dbs) dbs = Object.keys(this.databaseConnections)

      dbs.map(async (dbConnID) => {
        const result = dbManager.disconnectDB(
          this.databaseConnections[dbConnID].databaseType,
          this.databaseConnections[dbConnID]
        )

        if (result.err) {
          errors.push({ dbConnID, err: result.err })
        } else {
          list.push(dbConnID)
          delete this.databaseConnections[dbConnID]
        }
      })
    } catch (err) {
      callBack(err)
    } finally {
      if (errors.length > 0) callBack(errors, list)
      else callBack(null, list)
    }
  }
}

export default NIDB
