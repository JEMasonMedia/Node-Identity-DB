import SQLBuilder from 'json-sql-builder2'

// [ 'PostgreSQL', 'MySQL', 'MariaDB', 'Oracle', 'SQLServer', 'SQLite' ]

export default class createSQL {
  constructor(dbType) {
    this.dbType = dbType
    this.sqlBuilder = new SQLBuilder(dbType)
  }

  createTable = model => {
    let sql = this.sqlBuilder.$createTable({
      $table: model.modelName,
      $define: Object.keys(model.model)
        .map(field => {
          return {
            [field]: {
              $column: this.#defineField(model.model[field]),
            },
          }
        })
        .reduce((obj, v) => {
          return { ...obj, ...v }
        }, {}),
    })

    sql.values.forEach(v => {
      sql.sql = sql.sql.replace('?', `'${v}'`)
    })
    return sql
  }

  addColumns = (model, add) => {
    let m = JSON.parse(JSON.stringify(model))
    Object.keys(m.model).map(field => {
      if (!(add.indexOf(field) > -1)) {
        delete m.model[field]
      }
    })
    return this.createTable(m).sql.replace('CREATE', 'ALTER').replace('(', 'ADD COLUMN (')
  }

  dropColumns = (model, drop) => {
    return `ALTER TABLE ${model.modelName} DROP COLUMN ${drop.join(', ')}`.replaceAll(', ', ', DROP COLUMN ')
  }

  modifyColumns = (model, modify) => {
    return true
  }

  alterTable = (model, preserveData) => {
    // let define = {}
    // Object.keys(model.model)
    //   .map(field => {
    //     return {
    //       [field]: {
    //         $column: this.#defineField(model.model[field]),
    //       },
    //     }
    //   })
    //   .forEach(field => {
    //     define = {
    //       ...define,
    //       ...field,
    //     }
    //   })
    // return this.sqlBuilder.$alterTable({
    //   $table: model.modelName,
    //   $define: define,
    //   $preserveData: preserveData,
    // })
  }

  #defineField = field => {
    let column = {
      $type: this.#defineType(field.type),
      $size: field.size ? field.size : null,
      $notNull: field.nullable ? false : true,
      $autoInc: field.autoIncrement ? true : null,
      $primary: field.key === 'primary' ? true : null,
      $foreignKey: field.key === 'foreign' ? true : null,
      $default: field.defaultValue ? field.defaultValue : null,
    }

    Object.keys(column).map(c => {
      if (column[c] === null) {
        delete column[c]
      }
    })

    return column
  }

  convertType = type => {
    return this.#defineType(type).toString().toLocaleLowerCase()
  }

  #defineType = type => {
    switch (type) {
      case 'string':
        return 'VARCHAR'
      case 'int':
        return 'INT'
      case 'long':
        return 'BIGINT'
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
        return 'TEXT'
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
    number: 0.0,
    int: 0,
    long: 0,
    double: 0.0,
    boolean: false,
    unique: false,
    nullable: true,
    autoIncrement: false,
    primary: false,
    foreign: false,
    size: null,
    default: null,
    array: [],
    object: {},
    date: null,
    time: null,
    dateTime: null,
    timeStamp: null,
  }
}
