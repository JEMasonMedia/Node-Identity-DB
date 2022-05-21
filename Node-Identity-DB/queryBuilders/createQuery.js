import { allowedDBs } from '../supportedDBs/supportedDBs.js'
import SQLBuilder from 'json-sql-builder2'

export default class createQuery {
  constructor() {
    this.dbType = null
    this.query = null
    this.queryType = null
    this.sql = null
  }

  createTable = (dbType, model) => {
    this.dbType = dbType
    // console.log(dbType, model)
    // this.query = `CREATE TABLE ${model.tableName} (`
    // let fields = []
    // for (let field in model.fields) {
    //   fields.push(
    //     `${field} ${model.fields[field].type}`
    //   )
    // }
    // this.query += fields.join(', ')
    // this.query += ')'
    // return this.query

    this.sql = new SQLBuilder('MySQL')
    let myQuery = this.sql.$createTable({
      $table: 'people',
      $define: {
        columns: {},
      },
    })

    console.log(myQuery)
  }
}
