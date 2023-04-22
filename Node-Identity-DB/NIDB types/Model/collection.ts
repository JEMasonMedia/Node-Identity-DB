export interface ICollection<T> {
  fields: [[key: string], [value: T]]
  name: string
  add(key: string, value: T): void
  remove(key: string): void
  get(key: string): T | undefined
  has(key: string): boolean
  clear(): void
  size(): number
}

export class Collection<T> implements ICollection<T> {
  fields: [[key: string], [value: T]]
  name: string

  constructor(name: string, ...fields: Array<{ key: string; value: T }>) {
    fields.forEach(({ key, value }) => {
      this[key] = value
    })
    this.name = name
  }

  add(key: string, value: T): void {
    this[key] = value
  }

  remove(key: string): void {
    delete this[key]
  }

  get(key: string): T | undefined {
    return this[key]
  }

  has(key: string): boolean {
    return key in this
  }

  clear(): void {
    Object.keys(this).forEach(key => delete this[key])
  }

  size(): number {
    return Object.keys(this).length
  }
}

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
