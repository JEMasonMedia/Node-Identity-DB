import mysql from 'mysql2/promise'
import knex from 'knex'
import MySql2DBTranslator from '../Translators/MySql2DBTranslator.js'

export default class MySql2DBManager extends MySql2DBTranslator {
  dbType = 'MYSQLDB'
  translator = new MySql2DBTranslator()
  connection = null

  connectDB = async (connectionConfig, additionalConfig) => {
    try {
      // const conn = knex({
      //   client: 'mysql2',
      //   connectionConfig,
      // })

      // conn.raw('SELECT VERSION()').then((version) => console.log(version[0][0]))

      this.connection = await mysql.createConnection(connectionConfig)
      await this.connection.promise().connect()

      return this.connection
    } catch (err) {
      return { err }
    }
  }

  disconnectDB = async () => {
    try {
      await this.connection.end()
      await this.connection.release()
      return true
    } catch (err) {
      return { err }
    }
  }

  raw = async modelArgs => {
    try {
      return (await this.connection.connection.promise().query(modelArgs.query))[0]
    } catch (err) {
      return { err }
    }
  }

  tableExists = async model => {
    try {
      const numDocs = await this.connection.connection.promise().query(this.translator.getTableExistsQuery(model.modelName))
      return numDocs[0].length > 0 ? true : false
    } catch (err) {
      return { err }
    }
  }

  createTable = async model => {
    try {
      await this.connection.connection.promise().query(this.translator.getCreateTableQuery(model).sql)
      return true
    } catch (err) {
      return { err }
    }
  }

  renameField = async (model, oldNewName) => {
    try {
      await this.connection.connection.promise().query(this.translator.getRenameFieldQuery(model, oldNewName))
      return true
    } catch (err) {
      return { err }
    }
  }

  tableSchema = async modelName => {
    try {
      const schema = await this.connection.connection.promise().query(this.translator.getTableSchemaQuery(modelName))
      return schema[0]
    } catch (err) {
      return { err }
    }
  }

  // needs work
  alterTable = async (model, preserveData) => {
    try {
      const res = (await this.connection.connection.promise().query(this.translator.getTableSchemaQuery(model.modelName)))[0]
      const schema = this.convertSchema(model.modelName, res)
      const { add, drop, modify } = this.translator.compareSchema(schema, model)
      // console.log('add', add)
      // console.log('drop', drop)
      // console.log('modify', modify)

      if (add.length > 0) {
        await this.connection.connection.promise().query(this.translator.getAddColumnsQuery(model, add))
      }

      if (drop.length > 0) {
        if (preserveData) {
          for (let i = 0; i < drop.length; i++) {
            let s = this.translator.getRenameFieldQuery(model, {
              oldFieldName: drop[i],
              newFieldName: `preserve_${Date.now()}_${drop[i]}`,
            })
            await this.connection.connection.promise().query(s)
          }
        } else {
          await this.connection.connection.promise().query(this.translator.getDropColumnsQuery(model, drop))
        }
      }

      if (modify.length > 0) {
        for (let i = 0; i < modify.length; i++) {
          let key = model.model[modify[i]]?.key
          if (key !== null && ['primary', 'foreign'].includes(model.model[modify[i]]?.key)) {
            let which = {
              primary: {
                drop: 'getDropPrimaryKeyQuery',
                add: 'getAddPrimaryKeyQuery',
              },
              foreign: {
                drop: 'getDropForeignKeyQuery',
                add: 'getAddForeignKeyQuery',
              },
            }

            await this.connection.connection.promise().query(this.translator.getModifyColumnQuery(model, modify[i], 'no_auto_increment_key'))
            await this.connection.connection.promise().query(this.translator[which[key].drop](model, modify[i]))
            await this.connection.connection.promise().query(this.translator.getModifyColumnQuery(model, modify[i]))
          } else {
            await this.connection.connection.promise().query(this.translator.getModifyColumnQuery(model, [modify[i]]))
          }
        }
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

  dropTable = async modelName => {
    try {
      // const query = this.translator.getDropTableQuery(modelName)
      await this.connection.connection.promise().query(this.translator.getDropTableQuery(modelName))
      return true
    } catch (err) {
      return { err }
    }
  }

  prepareStatement = query => {
    try {
      return this.translator.getPreparedStatement(query).sql
    } catch (err) {
      return { err }
    }
  }

  executeStatement = async query => {
    try {
      return (await this.connection.connection.promise().query(query))[0]
    } catch (err) {
      return { err }
    }
  }
}
