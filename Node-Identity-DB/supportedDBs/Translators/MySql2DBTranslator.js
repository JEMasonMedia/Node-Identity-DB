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

  getAddColumnsQuery = (model, add) => {
    return this.createSQL.addColumns(model, add)
  }

  getDropColumnsQuery = (model, drop) => {
    return this.createSQL.dropColumns(model, drop)
  }

  getModifyColumnsQuery = (model, modify) => {
    return this.createSQL.modifyColumns(model, modify)
  }

  getDropTableQuery = modelName => {
    return `DROP TABLE ${modelName}`
  }

  compareSchema = (schema, model) => {
    if (schema[model.modelName] === null || schema[model.modelName] === undefined) return false
    if (schema[model.modelName].constructor !== Object) return false

    let modelKeys = Object.keys(model.model)
    let schemaKeys = Object.keys(schema[model.modelName])
    let differences = {
      add: [],
      drop: [],
      modify: [],
    }

    schemaKeys = schemaKeys.filter(key => key.includes('preserve_') === false)

    modelKeys.forEach(key => {
      if (schemaKeys.indexOf(key) === -1) differences.add.push(key)
    })

    schemaKeys.forEach(key => {
      if (modelKeys.indexOf(key) === -1) differences.drop.push(key)
    })

    schemaKeys.forEach(key => {
      if (modelKeys.indexOf(key) === -1) return
      if (!this.compareFields(model.model[key], schema[model.modelName][key])) {
        differences.modify.push(key)
      }
    })

    // console.log(modelKeys)
    // console.log(schemaKeys)
    // console.log(differences)

    return differences
  }

  compareFields = (field, testField) => {
    // let modelKeys = Object.keys(field)
    let schemaKeys = Object.keys(testField)
    let convertType

    // console.log(field)
    // console.log(modelKeys)
    // console.log(testField)
    // console.log(schemaKeys)

    for (let i = 0; i < schemaKeys.length; i++) {
      switch (schemaKeys[i]) {
        case 'Type':
          convertType = this.createSQL.convertType(field.type)
          if (convertType === 'varchar') {
            let type = testField.Type.split('(')[0]
            let size = testField.Type.split('(')[1].split(')')[0]
            if (type && size) {
              if (typeof field.size === 'undefined' || type !== convertType || size !== String(field.size)) return false
            }
          } else if (typeof field.type !== 'undefined' && testField.Type !== convertType) return false
          break
        case 'Null':
          convertType = testField.Null === 'NO' ? false : true
          if (typeof field.nullable !== 'undefined' && convertType !== field.nullable) return false
          break
        case 'Key':
          convertType = testField.Key === 'PRI' ? 'primary' : 'foreign'
          if (typeof field.key !== 'undefined' && convertType !== field.key) return false
          break
        case 'Default':
          if (typeof field.default !== 'undefined' && field.default !== testField.Default) return false
          break
        case 'Extra':
          convertType = testField.Extra === 'auto_increment' ? true : false
          if (typeof field.autoIncrement !== 'undefined' && field.autoIncrement !== convertType) return false
      }
    }
    return true
  }
}
