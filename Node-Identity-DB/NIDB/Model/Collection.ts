// type Field = {
//   key: string
//   type: string
//   unique?: boolean
//   nullable?: boolean
//   autoIncrement?: boolean
// }

// interface ICollection<T> {
//   add(item: T): void
//   remove(item: T): void
//   get(key: string): T | undefined
//   has(key: string): boolean
//   clear(): void
//   size(): number
//   toArray(): T[]
// }

// class Collection<T extends Record<string, unknown>> implements ICollection<T> {
//   private data: Record<string, T> = {}

//   constructor(private fields: Field[]) {}

//   private validateField(field: Field): void {
//     const validTypes = ['string', 'number', 'boolean']
//     if (!field.key || !field.type || !validTypes.includes(field.type)) {
//       throw new Error('Invalid field')
//     }
//   }

//   private validateItem(item: T): void {
//     const itemKeys = Object.keys(item)
//     const fieldKeys = this.fields.map(field => field.key)
//     const extraKeys = itemKeys.filter(key => !fieldKeys.includes(key))
//     if (extraKeys.length > 0) {
//       throw new Error(`Invalid item. Extra keys: ${extraKeys.join(', ')}`)
//     }
//     const missingKeys = this.fields.filter(field => field.nullable !== true && !itemKeys.includes(field.key))
//     if (missingKeys.length > 0) {
//       throw new Error(`Invalid item. Missing required keys: ${missingKeys.map(field => field.key).join(', ')}`)
//     }
//   }

//   add(item: T): void {
//     this.validateItem(item)
//     const key = item[this.fields[0].key] as string
//     this.data[key] = item
//   }

//   remove(item: T): void {
//     const key = item[this.fields[0].key] as string
//     delete this.data[key]
//   }

//   get(key: string): T | undefined {
//     return this.data[key]
//   }

//   has(key: string): boolean {
//     return key in this.data
//   }

//   clear(): void {
//     this.data = {}
//   }

//   size(): number {
//     return Object.keys(this.data).length
//   }

//   toArray(): T[] {
//     return Object.values(this.data)
//   }
// }

// import {Fields} from '../types'

// export interface ICollection<T> {
//   fields: [[key: string], [value: T]]
//   name: string
//   add(key: string, value: T): void
//   remove(key: string): void
//   get(key: string): T | undefined
//   has(key: string): boolean
//   clear(): void
//   size(): number
// }

// export class Collection<T> implements ICollection<T> {
//   fields: [[key: string], [value: T]]
//   name: string

//   constructor(name: string, ...fields: Array<{ key: string; value: T }>) {
//     fields.forEach(({ key, value }) => {
//       this[key] = value
//     })
//     this.name = name
//   }

//   add(key: string, value: T): void {
//     this[key] = value
//   }

//   remove(key: string): void {
//     delete this[key]
//   }

//   get(key: string): T | undefined {
//     return this[key]
//   }

//   has(key: string): boolean {
//     return key in this
//   }

//   clear(): void {
//     Object.keys(this).forEach(key => delete this[key])
//   }

//   size(): number {
//     return Object.keys(this).length
//   }
// }

/*
interface ICollection<T> {
  add(key: string, value: T): void
  remove(key: string): void
  get(key: string): T | undefined
  has(key: string): boolean
  clear(): void
  size(): number
}

export default class Collection<T> implements ICollection<T> {
  private fields: { [key: string]: T } = {}

  constructor(...fields: Array<{ key: string; value: T }>) {
    fields.forEach(({ key, value }) => {
      this[key] = value
    })
  }

  add(key: string, value: T): void {
    this.fields[key] = value
  }

  remove(key: string): void {
    delete this.fields[key]
  }

  get(key: string): T | undefined {
    return this.fields[key]
  }

  has(key: string): boolean {
    return key in this.fields
  }

  clear(): void {
    this.fields = {}
  }

  size(): number {
    return Object.keys(this.fields).length
  }
}
*/
