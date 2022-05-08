import connectionManager from '../db_connections/connectionManager.js'

export default class queryBuilder {
  constructor() {
    // this.where = null
    // this.orderBy = null
    // this.limit = null
    // this.offset = null
    // this.select = null
    // this.distinct = null
    // this.groupBy = null
    // this.having = null
    // this.join = null
    // this.union = null
    // this.intersect = null
    // this.except = null
    // this.createTable = null
    // this.alterTable = null
  }

  tableExists = (modelName) => {
    return `SHOW TABLES LIKE '${modelName}'`
  }

  createTable = (modelName) => {
    // const createTableQuery = `CREATE TABLE ${modelName} (
    //   _id VARCHAR(255) PRIMARY KEY,
    //   name VARCHAR(255) NOT NULL,
    //   description VARCHAR(255) NULL,
    //   quantity INT NOT NULL
    // )`

    return this.models[modelName].modelName
  }

  alterTable = () => {
    const query = new queryBuilder()
    query.query.createTable = model
    return query
  }

  genericTypes = {
    string: '',
    number: 0,
    boolean: false,
    array: [],
    object: {},
  }
}
