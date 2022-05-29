import mysql from 'mysql2/promise'
import knex from 'knex'
import MySql2DBTranslator from '../Translators/MySql2DBTranslator.js'

export default class MySql2DBManager {
  static dbType = 'MYSQLDB'
  static translator = new MySql2DBTranslator()

  static connectDB = async (connectionConfig, additionalConfig) => {
    try {
      // const conn = knex({
      //   client: 'mysql2',
      //   connectionConfig,
      // })

      // conn.raw('SELECT VERSION()').then((version) => console.log(version[0][0]))

      const conn = await mysql.createConnection(connectionConfig)
      await conn.connect()

      return conn
    } catch (err) {
      return { err }
    }
  }

  static disconnectDB = async dbConn => {
    try {
      await dbConn.end()
      await dbConn.release()
      return true
    } catch (err) {
      return { err }
    }
  }

  static raw = async (dbConn, query) => {
    // NOT IMPLEMENTED
    // try {
    //   return await this.databaseConnections[
    //     dbConn_table_query.whichConnection
    //   ].connectionManager.raw(
    //     this.databaseConnections[dbConn_table_query.whichConnection].connection,
    //     this.databaseConnections[dbConn_table_query.whichConnection].models[
    //       dbConn_table_query.modelName
    //     ],
    //     dbConn_table_query.query
    //   )
    // } catch (err) {
    //   return { err }
    // }
  }

  static tableExists = async (dbConn, model) => {
    try {
      const query = this.translator.getTableExistsQuery(model.modelName)
      const numDocs = await dbConn.connection.promise().query(query)
      return numDocs[0].length > 0 ? true : false
    } catch (err) {
      return { err }
    }
  }

  static createTable = async (dbConn, model) => {
    try {
      const query = this.translator.getCreateTableQuery(model)
      await dbConn.connection.promise().query(query.sql)
      return true
    } catch (err) {
      return { err }
    }
  }

  static renameField = async (dbConn, model, oldNewName) => {
    try {
      const query = this.translator.getRenameFieldQuery(model, oldNewName)
      await dbConn.connection.promise().query(query)
      return true
    } catch (err) {
      return { err }
    }
  }

  static alterTable = async (dbConn, model, preserveData) => {
    try {
      const query = this.translator.getAlterTableQuery(model, preserveData)
      await dbConn.connection.promise().query(query.sql)
      return true
    } catch (err) {
      return { err }
    }
  }
}
