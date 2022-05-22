import SQLBuilder from 'json-sql-builder2'

export default class createSQL {
  constructor(dbType) {
    this.dbType = dbType
  }

  createTable = (model) => {
    let sql = new SQLBuilder(this.dbType)
    let define = {}

    Object.keys(model.model)
      .map((field) => {
        return {
          [field]: {
            $column: this.#defineField(model.model[field]),
          },
        }
      })
      .forEach((field) => {
        define = {
          ...define,
          ...field,
        }
      })

    let myQuery = sql.$createTable({
      $table: model.modelName,
      $define: define,
    })

    return myQuery
  }

  #defineField = (field) => {
    let column = {
      $type: this.#defineType(field.type),
      $size: field.size ? field.size : null,
      $notNull: field.nullable ? false : true,
      $autoInc: field.autoIncrement ? true : null,
      $primary: field.key === 'primary' ? true : null,
      $foreignKey: field.key === 'secondary' ? true : null,
    }

    Object.keys(column).map((c) => {
      if (column[c] === null) {
        delete column[c]
      }
    })

    return column
  }

  #defineType = (type) => {
    switch (type) {
      case 'string':
        type = 'VARCHAR'
        break
      case 'int':
        type = 'INT'
        break
      case 'number':
        type = 'DECIMAL'
        break
      case 'double':
        type = 'DOUBLE'
        break
      case 'boolean':
        type = 'BOOLEAN'
        break
      case 'date':
        type = 'DATE'
        break
      case 'time':
        type = 'TIME'
        break
      case 'dateTime':
        type = 'DATETIME'
        break
      case 'timestamp':
        type = 'TIMESTAMP'
        break
      case 'array':
        type = 'ARRAY'
        break
      case 'object':
        type = 'JSON'
        break
      default:
        type = 'VARCHAR'
        break
    }

    return type
  }

  #genericTypes = {
    string: '',
    number: 0,
    double: 0.0,
    boolean: false,
    array: [],
    object: {},
    date: null,
    time: null,
    dateTime: null,
    timeStamp: null,
  }
}
