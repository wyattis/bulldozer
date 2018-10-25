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
    if (this.currentScene) {
      await this.currentScene.destroy()
    }
    this.engine.reset()

    const nextScene = this.scenes.get(name)
    if (nextScene) {
      this.currentScene = nextScene
      this.currentScene.load()
      await this.engine.start()
      await this.currentScene.init()
      this.engine.update(this.currentScene.update.bind(this.currentScene))
      this.engine.render(this.currentScene.render.bind(this.currentScene))
    }
  }
}