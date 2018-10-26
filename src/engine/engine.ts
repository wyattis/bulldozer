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

interface UpdateFunction {
  (timestamp: number, delta: number): void
}

interface RenderFunction {
  (ctx: CanvasRenderingContext2D): void
}

interface ProgressFunction {
  (completed: number, total: number): any
}

interface QueueObj {
  url: string
  type: CacheType
  key: string
}

export default class Engine {

  private isRunning: boolean = false
  private animationFrameId: number|null = null
  private cache: Cache = new Cache()
  private loadQueue: QueueObj[] = []
  private previousTimestamp: number = 0
  private updateCbs: UpdateFunction[] = []
  private renderCbs: RenderFunction[] = []

  readonly ctx: CanvasRenderingContext2D

  constructor (parent?: string|HTMLElement) {
    this.ctx = this.mount(parent || document.body)
    this.loop = this.loop.bind(this)
  }

  private mount (parent: string|HTMLElement): CanvasRenderingContext2D {
    if (typeof parent === 'string') {
      parent = document.querySelector(parent) as HTMLElement
    }
    const canvas: HTMLCanvasElement = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    parent.appendChild(canvas)
    if (ctx) {
      return ctx
    } else {
      throw Error('no 2d ctx')
    }
  }

  public load (key: string, url: string, type: CacheType = CacheType.IMAGE): void {
    this.loadQueue.push({
      key,
      url,
      type
    })
  }

  private startLoad (progressCb?: ProgressFunction): Promise<void> {
    const numToLoad = this.loadQueue.length
    let numLoaded = 0
    return new Promise((resolve, reject) => {
      function checkDone () {
        if (progressCb) {
          progressCb(numLoaded, numToLoad)
        }
        if (numLoaded >= numToLoad) {
          resolve()
        }
      }
      // If there's nothing to load.
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

  public async start (progressCb?: ProgressFunction): Promise<void> {
    await this.startLoad(progressCb)
    this.isRunning = true
    this.previousTimestamp = Date.now()
    this.animationFrameId = requestAnimationFrame(this.loop)
  }

  public update (cb: UpdateFunction): void {
    this.updateCbs.push(cb)
  }

  public render (cb: RenderFunction): void {
    this.renderCbs.push(cb)
  }

  public stop () {
    this.isRunning = false
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }
  }

  public reset () {
    this.stop()
    this.updateCbs = []
    this.renderCbs = []
  }

  private _update (timestamp: number, delta: number): void {
    let i = this.updateCbs.length
    while (i--) {
      this.updateCbs[i](timestamp, delta)
    }
  }

  private _render (): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    let i = this.renderCbs.length
    while (i--) {
      this.renderCbs[i](this.ctx)
    }
  }

  private loop (timestamp: number): void {
    const delta: number = timestamp - this.previousTimestamp
    this.previousTimestamp = timestamp
    this._update(timestamp, delta)
    this._render()
    this.animationFrameId = requestAnimationFrame(this.loop)
  }
}