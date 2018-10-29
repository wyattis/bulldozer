export enum CacheType {
  IMAGE,
  JSON
}

export default class Cache {
  private keys: Map<string, any> = new Map()
  add (key: string, val: any, type: CacheType) {
    return this.keys.set(key, val)
  }

  get (key: string): any {
    return this.keys.get(key)
  }
}