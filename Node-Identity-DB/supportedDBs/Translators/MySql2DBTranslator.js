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
    // return this.createSQL.renameField(model, oldNewName)
    return `ALTER TABLE ${model.modelName} RENAME COLUMN ${oldNewName.oldFieldName} TO ${oldNewName.newFieldName}`
  }

  getTableSchemaQuery = modelName => {
    return `SHOW COLUMNS FROM ${modelName}`
  }

  getAlterTableQuery = (model, preserveData) => {
    return this.createSQL.alterTable(model, preserveData)
  }

  getDropTableQuery = modelName => {
    return `DROP TABLE ${modelName}`
  }

  compareSchema = (schema, model) => {
    if (schema[model.modelName] === null || schema[model.modelName] === undefined) return false
    if (schema[model.modelName].constructor !== Object) return false

    let modelKeys = Object.keys(model.model)
    let schemaKeys = Object.keys(schema[model.modelName])
    // add, drop, modify
    let differences = {
      add: [],
      drop: [],
      modify: [],
    }

    for (let i = 0; i < modelKeys.length; i++) {
      let testIndexOf = modelKeys.indexOf(modelKeys[i])
      if (testIndexOf > -1) {
        if (!this.compareFields(model.model[modelKeys[i]], schema[model.modelName][schemaKeys[testIndexOf]])) {
          differences.modify.push(modelKeys[i])
        }
      } else if (testIndexOf === -1) {
        differences.add.push(modelKeys[i])
      } else {
        differences.drop.push(modelKeys[i])
      }
    }

    // console.log(modelKeys)
    // console.log(schemaKeys)
    // console.log(differences)

    return true
  }

  compareFields = (field, testField) => {
    console.log(field)
    console.log(testField)
  }
}
