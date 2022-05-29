import SQLBuilder from 'json-sql-builder2'

// Setup a new instance for MySQL
// var sql = new SQLBuilder('MySQL');

// Setup a new instance for MariaDB
// var sql = new SQLBuilder('MariaDB');

// Setup a new instance for PostgreSQL
// var sql = new SQLBuilder('PostgreSQL');

// Setup a new instance for SQLite
// var sql = new SQLBuilder('SQLite');

// Setup a new instance for Oracle
// var sql = new SQLBuilder('Oracle');

// Setup a new instance for SQLServer
// var sql = new SQLBuilder('SQLServer');

export default class createSQL {
  constructor(dbType) {
    this.dbType = dbType
    this.sqlBuilder = new SQLBuilder(dbType)
  }

  createTable = model => {
    let define = {}

    Object.keys(model.model)
      .map(field => {
        return {
          [field]: {
            $column: this.#defineField(model.model[field]),
          },
        }
      })
      .forEach(field => {
        define = {
          ...define,
          ...field,
        }
      })

    return this.sqlBuilder.$createTable({
      $table: model.modelName,
      $define: define,
    })
  }

  // will need to account for sql server
  // possible downgrade to translator as it is a narrow function
  renameField = (model, oldNewName) => {
    return `ALTER TABLE ${model.modelName} RENAME COLUMN ${oldNewName.oldFieldName} TO ${oldNewName.newFieldName}`
  }

  alterTable = (model, preserveData) => {
    let define = {}

    Object.keys(model.model)
      .map(field => {
        return {
          [field]: {
            $column: this.#defineField(model.model[field]),
          },
        }
      })
      .forEach(field => {
        define = {
          ...define,
          ...field,
        }
      })

    return this.sqlBuilder.$alterTable({
      $table: model.modelName,
      $define: define,
      $preserveData: preserveData,
    })
  }

  #defineField = field => {
    let column = {
      $type: this.#defineType(field.type),
      $size: field.size ? field.size : null,
      $notNull: field.nullable ? false : true,
      $autoInc: field.autoIncrement ? true : null,
      $primary: field.key === 'primary' ? true : null,
      $foreignKey: field.key === 'secondary' ? true : null,
    }

    Object.keys(column).map(c => {
      if (column[c] === null) {
        delete column[c]
      }
    })

    return column
  }

  #defineType = type => {
    switch (type) {
      case 'string':
        return 'VARCHAR'
      case 'int':
        return 'INT'
      case 'number':
        return 'DECIMAL'
      case 'double':
        return 'DOUBLE'
      case 'boolean':
        return 'BOOLEAN'
      case 'date':
        return 'DATE'
      case 'time':
        return 'TIME'
      case 'dateTime':
        return 'DATETIME'
      case 'timestamp':
        return 'TIMESTAMP'
      case 'array':
      case 'object':
        return this.#objectType()
      default:
        return 'VARCHAR'
    }
  }

  #objectType = () => {
    switch (this.dbType) {
      case 'MySQL':
      case 'MariaDB':
        return 'JSON'
      case 'PostgreSQL':
        return 'JSONB'
      case 'SQLite':
      case 'Oracle':
        return 'BLOB'
      case 'SQLServer':
        return 'NVARCHAR(MAX)'
      default:
        return 'TEXT'
    }
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
