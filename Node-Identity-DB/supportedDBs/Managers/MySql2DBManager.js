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
      // const query = this.translator.getTableExistsQuery(model.modelName)
      const numDocs = await dbConn.connection.promise().query(this.translator.getTableExistsQuery(model.modelName))
      return numDocs[0].length > 0 ? true : false
    } catch (err) {
      return { err }
    }
  }

  static createTable = async (dbConn, model) => {
    try {
      // const query = this.translator.getCreateTableQuery(model)
      await dbConn.connection.promise().query(this.translator.getCreateTableQuery(model).sql)
      return true
    } catch (err) {
      return { err }
    }
  }

  static renameField = async (dbConn, model, oldNewName) => {
    try {
      // const query = this.translator.getRenameFieldQuery(model, oldNewName)
      await dbConn.connection.promise().query(this.translator.getRenameFieldQuery(model, oldNewName))
      return true
    } catch (err) {
      return { err }
    }
  }

  static tableSchema = async (dbConn, modelName) => {
    try {
      // const query = this.translator.getTableSchemaQuery(modelName)
      const schema = await dbConn.connection.promise().query(this.translator.getTableSchemaQuery(modelName))
      return schema[0]
    } catch (err) {
      return { err }
    }
  }

  static alterTable = async (dbConn, model, preserveData) => {
    try {
      // const query = this.translator.getAlterTableQuery(model, preserveData)
      // await dbConn.connection.promise().query(query.sql)

      const res = (await dbConn.query(this.translator.getTableSchemaQuery(model.modelName)))[0]
      const schema = this.convertSchema(model.modelName, res)
      // console.log(schema[model.modelName])
      const same = this.translator.compareSchema(schema, model)

      return true
    } catch (err) {
      return { err }
    }
  }

  static dropTable = async (dbConn, modelName) => {
    try {
      // const query = this.translator.getDropTableQuery(modelName)
      await dbConn.connection.promise().query(this.translator.getDropTableQuery(modelName))
      return true
    } catch (err) {
      return { err }
    }
  }

  static convertSchema = (tableName, tableSchema) => {
    return {
      [`${tableName}`]: tableSchema
        .map(({ Field, ...rest }) => {
          return { [`${Field}`]: rest }
        })
        .reduce((field, rest) => {
          return { ...field, ...rest }
        }, {}),
    }
  }
}
