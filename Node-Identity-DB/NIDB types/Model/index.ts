import { ICollection, Collection } from './collection'
import { IConnection, Connection } from '../_Connection/Connection'

// interface Model {
//   collection: any // model
//   connection: any // connection
//   queryBuilder: any // queryBuilder
// }

export default class Model {
  collection: ICollection<any>
  connection: IConnection<any>
  queryBuilder

  constructor(collection, connection) {
    this.collection = new Collection(collection)
    this.connection = new Connection(connection)
    return this
  }
}
