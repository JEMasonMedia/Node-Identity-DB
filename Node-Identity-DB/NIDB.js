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
import dbManager from './db_connections/dbManager.js'

const NIDB = class {
  databaseConnections = {}
  Models = {}

  static useDatabase = async (
    databaseType,
    connectionConfig,
    additionalConfig,
    callBack
  ) => {
    let DBconnID = helpers.createComplexString([7, 12, 7])
    this.databaseConnections = {
      ...this.databaseConnections,
      [`${DBconnID}`]: {
        DBconnID,
        databaseType,
        connectionConfig,
        connection: null,
      },
    }

    const conn = await dbManager.connectDB(
      databaseType,
      connectionConfig,
      additionalConfig
    )

    if (conn.err) {
      delete this.databaseConnections[`${DBconnID}`]
      callBack(conn.err)
    } else {
      this.databaseConnections[`${DBconnID}`].connection = conn
      callBack(null, this.databaseConnections[`${DBconnID}`])
      return DBconnID
    }
  }

  static useModel = (model, additionalConfig) => {
    // console.log(this.models)
    this.models.push('321')
    return this
  }

  static createStore = (config) => {}

  static closeConnections = (dbs, callBack) => {
    let list = []
    let errors = []

    try {
      if (!dbs) dbs = Object.keys(this.databaseConnections)

      dbs.map(async (dbConnID) => {
        const result = dbManager.closeConnections(
          this.databaseConnections[dbConnID].databaseType,
          this.databaseConnections[dbConnID]
        )

        if (result.err) {
          errors.push({ dbConnID, err: result.err })
        } else {
          list.push(dbConnID)
          // console.log('close if', list)
          delete this.databaseConnections[dbConnID]
        }
      })
    } finally {
      // console.log('after map', list)

      if (errors.length > 0) callBack(errors, list)
      else callBack(null, list)
    }
  }
}

export default NIDB
