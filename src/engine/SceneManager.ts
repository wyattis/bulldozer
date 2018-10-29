import Engine, {ProgressFunction} from "./Engine";
import Scene, {SceneOptions} from "./Scene";

export interface StartOptions {
  loadData?: any
  initData?: any
  loadProgress?: ProgressFunction
}

interface T extends Scene {}

export default class SceneManager {
  private currentScene?: T
  private scenes: Map<string, T> = new Map()

  constructor (public engine: Engine) {}

  add (name: string, scene: T) {
    this.scenes.set(name, scene)
  }

  async start (name: string, opts: StartOptions = {}) {
    if (this.currentScene && this.currentScene.destroy) {
      await this.currentScene.destroy()
    }
    this.engine.reset()

    const nextScene = this.scenes.get(name)
    if (nextScene) {
      this.currentScene = nextScene
      if (this.currentScene.preload) {
        this.currentScene.preload(opts.loadData)
      }
      await this.engine.start(opts.loadProgress)
      if (this.currentScene.init) {
        await this.currentScene.init(opts.initData)
      }
      if (this.currentScene.update) {
        this.engine.update(this.currentScene.update.bind(this.currentScene))
      }
      if (this.currentScene.render) {
        this.engine.render(this.currentScene.render.bind(this.currentScene))
      }
    } else {
      console.error(`No scene with that name defined`)
    }
  }
}