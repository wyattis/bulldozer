import Scene from "./scene";
import Engine from "./engine";



export default class SceneManager {
  private currentScene?: Scene
  private scenes: Map<string, Scene> = new Map()

  constructor (private engine: Engine) {}

  add (name: string, scene: Scene) {
    this.scenes.set(name, scene)
  }

  async start (name: string) {
    if (this.currentScene && this.currentScene.destroy) {
      await this.currentScene.destroy()
    }
    this.engine.reset()

    const nextScene = this.scenes.get(name)
    if (nextScene) {
      this.currentScene = nextScene
      if (this.currentScene.load) {
        this.currentScene.load()
      }
      await this.engine.start()
      if (this.currentScene.init) {
        await this.currentScene.init()
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