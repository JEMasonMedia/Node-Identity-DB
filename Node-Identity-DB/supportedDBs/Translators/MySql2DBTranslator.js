import createSQL from './createSQL.js'

export default class MySql2DBTranslator {
  createSQL = new createSQL('MySQL')

  getTableExistsQuery = modelName => {
    return `SHOW TABLES LIKE '${modelName}'`
  }

  getCreateTableQuery = model => {
    return this.createSQL.createTable(model)
  }

  getRenameFieldQuery = (model, oldNewName) => {
    return this.createSQL.renameField(model, oldNewName)
  }

  getAlterTableQuery = (model, preserveData) => {
    return this.createSQL.alterTable(model, preserveData)
  }

  getDropTableQuery = modelName => {
    return `DROP TABLE ${modelName}`
  }
}
