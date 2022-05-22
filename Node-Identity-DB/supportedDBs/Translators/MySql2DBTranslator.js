import createSQL from './createSQL.js'

export default class MySql2DBTranslator {
  // constructor() {
  //   this.createSQL = new createSQL('MySQL')
  // }
  createSQL = new createSQL('MySQL')

  getCreateTableQuery = (model) => {
    // let query = `CREATE TABLE ${tableName} (`
    // let fields = []
    // for (let field in tableColumns) {
    //   fields.push(
    //     `${field} ${tableColumns[field].type}`
    //   )
    // }
    // query += fields.join(', ')
    // query += ')'
    return this.createSQL.createTable(model)
  }
}
