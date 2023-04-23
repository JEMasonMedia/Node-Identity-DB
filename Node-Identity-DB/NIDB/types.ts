type ColumnType = {
  string?: string
  number?: number
  int?: number
  long?: number
  double?: number
  boolean?: boolean
  unique?: boolean
  nullable?: boolean
  autoIncrement?: boolean
  primary?: boolean
  foreign?: boolean
  size?: number | null
  default?: any
  array?: any[]
  object?: Record<string, any>
  date?: Date | null
  time?: Date | null
  dateTime?: Date | null
  timeStamp?: Date | null
}

type Key = 'primary' | 'foreign' | 'normal'

type defaultValue = string | number | boolean | Date | null

type Column = {
  // type: ColumnType[keyof ColumnType]
  // type?: Partial<ColumnType>
  // type: Partial<ColumnType[keyof ColumnType]>
  type: ColumnType
  // type: keyof ColumnType
  key?: Key
  size?: number
  unique?: boolean
  nullable?: boolean
  autoIncrement?: boolean
  defaultValue?: defaultValue
  [key: string]: any // index signature
}

type Table = {
  [key: string]: Column
}

type ModelData = {
  [key: string]: Table
}

class QueryBuilder {
  private query: string

  constructor() {
    this.query = ''
  }

  select(...columns: string[]): QueryBuilder {
    this.query += `SELECT ${columns.join(', ')} `
    return this
  }

  from(table: string): QueryBuilder {
    this.query += `FROM ${table} `
    return this
  }

  where(condition: string): QueryBuilder {
    this.query += `WHERE ${condition} `
    return this
  }

  execute(): any[] {
    // execute the query and return the result
    return []
  }

  getQuery(): string {
    return this.query
  }
}

class Model {
  private Models: ModelData

  constructor(data: any) {
    this.Models = this.createModelData(data)
  }

  private createModelData(table: Table): ModelData {
    const modelData: ModelData = {}
    for (const tableName in table) {
      const columns = table[tableName]
      let modelTable: Table = {}
      for (const columnName in columns) {
        // this needs error and validation handling /////////////////////////////////////////////////////////////////////////////////////
        let modelColumn: Column = columns[columnName]
        modelTable[columnName] = modelColumn
      }
      modelData[tableName] = modelTable
    }
    return modelData
  }

  select(table: string, ...columns: string[]): QueryBuilder {
    const qb = new QueryBuilder()
    qb.select(...columns).from(table)
    return qb
  }

  insert(table: string, data: any): void {
    // generate the insert query and execute it
  }

  update(table: string, data: any, condition: string): void {
    // generate the update query and execute it
  }

  delete(table: string, condition: string): void {
    // generate the delete query and execute it
  }
}

// Example usage
const data = {
  users: {
    _id: { type: 'long', key: 'primary', autoIncrement: true },
    name: { type: 'string', defaultValue: 'name' },
    age: { type: 'int', nullable: true, defaultValue: 0 },
  },
  cart: {
    _id: { type: 'long', key: 'primary', autoIncrement: true },
    item_name: { type: 'string', defaultValue: 'item_name' },
    price: { type: 'string', nullable: true, double: 0.0 },
  },
}

const model = new Model(data)
console.log(model)

// select query
const selectQuery = model.select('users', '_id', 'name').where('age > 18').getQuery()
console.log(selectQuery)
// Output: SELECT _id, name FROM users WHERE age > 18
