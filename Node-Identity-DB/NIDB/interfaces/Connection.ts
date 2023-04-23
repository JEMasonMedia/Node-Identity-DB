export interface IConnection<T> {
  dbName: string
  dbType: string
  connection: T
  isConnected: boolean
  connectDB: () => Promise<{ err: string; db: T }>
  disconnectDB: () => Promise<{ err: string; db: T }>
}

export class Connection<T> implements IConnection<T> {
  dbName: string
  dbType: string
  connection: T
  isConnected: boolean

  constructor(...items: Array<{ key: string; value: T }>) {
    items.forEach(({ key, value }) => {
      this[key] = value
    })
  }

  connectDB: () => Promise<{ err: string; db: T }>
  disconnectDB: () => Promise<{ err: string; db: T }>
}
