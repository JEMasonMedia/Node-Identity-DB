import mysql from 'mysql2/promise'
import knex from 'knex'
import MySql2DBTranslator from '../Translators/MySql2DBTranslator.js'

export default class MySql2DBManager extends MySql2DBTranslator {
  dbType = 'MYSQLDB'
  translator = new MySql2DBTranslator()

  connectDB = async (connectionConfig, additionalConfig) => {
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

  disconnectDB = async dbConn => {
    try {
      await dbConn.end()
      await dbConn.release()
      return true
    } catch (err) {
      return { err }
    }
  }

  raw = async (dbConn, query) => {
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

  tableExists = async (dbConn, model) => {
    try {
      const numDocs = await dbConn.connection.promise().query(this.translator.getTableExistsQuery(model.modelName))
      return numDocs[0].length > 0 ? true : false
    } catch (err) {
      return { err }
    }
  }

  createTable = async (dbConn, model) => {
    try {
      await dbConn.connection.promise().query(this.translator.getCreateTableQuery(model).sql)
      return true
    } catch (err) {
      return { err }
    }
  }

  renameField = async (dbConn, model, oldNewName) => {
    try {
      await dbConn.connection.promise().query(this.translator.getRenameFieldQuery(model, oldNewName))
      return true
    } catch (err) {
      return { err }
    }
  }

  tableSchema = async (dbConn, modelName) => {
    try {
      const schema = await dbConn.connection.promise().query(this.translator.getTableSchemaQuery(modelName))
      return schema[0]
    } catch (err) {
      return { err }
    }
  }

  alterTable = async (dbConn, model, preserveData) => {
    try {
      // const query = this.translator.getAlterTableQuery(model, preserveData)
      // await dbConn.connection.promise().query(query.sql)

      const res = (await dbConn.connection.promise().query(this.translator.getTableSchemaQuery(model.modelName)))[0]
      const schema = this.convertSchema(model.modelName, res)
      // console.log(schema[model.modelName])
      const { add, drop, modify } = this.translator.compareSchema(schema, model)
      console.log('add', add)
      console.log('drop', drop)
      console.log('modify', modify)

      if (add.length > 0) {
        await dbConn.connection.promise().query(this.translator.getAddColumnsQuery(model, add))
      }

      if (drop.length > 0) {
        if (preserveData) {
          for (let i = 0; i < drop.length; i++) {
            let s = this.translator.getRenameFieldQuery(model, {
              oldFieldName: drop[i],
              newFieldName: `preserve_${Date.now()}_${drop[i]}`,
            })
            await dbConn.connection.promise().query(s)
          }
        } else {
          await dbConn.connection.promise().query(this.translator.getDropColumnsQuery(model, drop))
        }
      }

      if (modify.length > 0) {
        let modQ = this.translator.getModifyColumnsQuery(model, modify)
        console.log(modQ)
        // await dbConn.connection.promise().query()
      }

      return true
    } catch (err) {
      return { err }
    }
  }

  convertSchema = (tableName, tableSchema) => {
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

  dropTable = async (dbConn, modelName) => {
    try {
      // const query = this.translator.getDropTableQuery(modelName)
      await dbConn.connection.promise().query(this.translator.getDropTableQuery(modelName))
      return true
    } catch (err) {
      return { err }
    }
  }
}
