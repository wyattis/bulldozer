export enum CacheType {
  IMAGE
}

export class Cache {
  private keys: Map<string, any> = new Map()
  add (key: string, val: any, type: CacheType) {
    this.keys.set(key, val)
  }

  get (key: string): any {
    this.keys.get(key)
  }
}


interface QueueObj {
  url: string
  type: CacheType
  key: string
}

export default class Engine {
  private cache: Cache = new Cache()
  private loadQueue: QueueObj[] = []
  private previousTimestamp: number = 0
  private updateCbs: Function[] = []
  private renderCbs: Function[] = []

  constructor (public fps: number = 60) {
    this.loop = this.loop.bind(this)
  }

  public load (key: string, url: string, type: CacheType = CacheType.IMAGE) {
    this.loadQueue.push({
      key,
      url,
      type
    })
  }

  private startLoad (): Promise<void> {
    const numToLoad = this.loadQueue.length
    let numLoaded = 0
    return new Promise((resolve, reject) => {
      function checkDone () {
        if (numLoaded >= numToLoad) {
          resolve()
        }
      }
      // If no images are being loaded.
      checkDone()
      for (let q of this.loadQueue) {
        switch (q.type) {
          case CacheType.IMAGE:
          let image = new Image()
          image.src = q.url
          image.onload = (ev: Event) => {
            numLoaded++
            this.cache.add(q.key, image, q.type)
            checkDone()
          }
          image.onerror = (err) => {
            numLoaded++
            console.error(err)
            checkDone()
          }
        }
      }
    })

  }

  public async start (): Promise<void> {
    await this.startLoad()
    this.previousTimestamp = Date.now()
    requestAnimationFrame(this.loop)
  }

  public update (cb: Function): void {
    this.updateCbs.push(cb)
  }

  public render (cb: Function): void {
    this.renderCbs.push(cb)
  }

  private _update (timestamp: number, delta: number) {
    for (let cb of this.updateCbs) {
      cb(timestamp, delta)
    }
  }

  private _render () {

  }

  private loop (timestamp: number) {
     const delta: number = timestamp - this.previousTimestamp
     this._update(timestamp, delta)
     this._render()
     requestAnimationFrame(this.loop)
  }
}