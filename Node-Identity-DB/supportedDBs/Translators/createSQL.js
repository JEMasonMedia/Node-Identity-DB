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

  modifyColumn = (model, modify, type) => {
    let m = JSON.parse(JSON.stringify(model))
    Object.keys(m.model).map(field => {
      if (modify !== field) {
        delete m.model[field]
      }
    })
    let sql = this.createTable(m).sql.replace('CREATE', 'ALTER').replace('(', 'MODIFY ')

    if (type === 'no_auto_increment_key') {
      sql = sql.replace('AUTO_INCREMENT', '').replace('PRIMARY KEY', '').trim()
    }

    return sql.slice(0, sql.lastIndexOf(')'))
  }

  prepareStatement = queryObject => {
    let sql
    switch (queryObject.queryType) {
      case 'select':
        sql = this.sqlBuilder[`$${queryObject.queryType}`]({
          ...this.#select(queryObject.select),
          $from: queryObject.model.modelName,
          $where: { ...queryObject.where },
        })
        sql.values.forEach(v => {
          sql.sql = sql.sql.replace('?', `'${v}'`)
        })
        return sql
      // return this.createTable(queryObject.model)
      case 'update':
      // return this.addColumns(queryObject.model, queryObject.add)
      case 'insert':
      // return this.dropColumns(queryObject.model, queryObject.drop)
      case 'delete':
      // return this.modifyColumn(queryObject.model, queryObject.modify, queryObject.type)
      default:
        return new Error('Unknown query type')
    }
  }

  convertType = (type, size) => {
    if (type !== 'string') return this.#defineType(type).toString().toLowerCase()

    let [t, s] = this.#stringSize(type, size)
    return this.#defineType(t).toString().toLowerCase()
  }

  #select = what => {
    return what !== null
      ? {
          ...what
            .map(field => {
              return {
                [field]: 1,
              }
            })
            .reduce((obj, v) => {
              return { ...obj, ...v }
            }, {}),
        }
      : null
  }

  #defineField = field => {
    let [type, size] = this.#stringSize(field.type, field?.size)

    let column = {
      // $type: this.#defineType(field.type),
      // $size: field.size ? field.size : null,
      $type: this.#defineType(type),
      $size: size ? size : null,
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

  #stringSize = (type, size) => {
    if (type !== 'string') return [type, size]

    if (size > 0 && size < 256) {
      return ['VARCHAR', size]
    }

    return [this.#stringType(), null]
  }

  #defineType = type => {
    switch (type) {
      // case 'string':
      //   return 'VARCHAR'
      case 'VARCHAR':
        return 'VARCHAR'
      case 'LONGTEXT':
        return 'LONGTEXT'
      case 'TEXT':
        return 'TEXT'
      case 'BLOB':
        return 'BLOB'
      case 'NVARCHAR(MAX)':
        return 'NVARCHAR(MAX)'
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
        return this.#stringType()
    }
  }

  possibleStringTypes = ['VARCHAR', 'NVARCHAR(MAX)', 'TEXT', 'LONGTEXT', 'BLOB']

  #stringType = () => {
    switch (this.dbType) {
      case 'MySQL':
      case 'MariaDB':
      case 'PostgreSQL':
        return 'LONGTEXT'
      case 'SQLite':
        return 'TEXT'
      case 'Oracle':
        return 'BLOB'
      case 'SQLServer':
        return 'NVARCHAR(MAX)'
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
