import Scene from "../engine/Scene";
import SceneManager from "../engine/SceneManager";
import Boulder from "../game/Boulder";
import Dozer from "../game/Dozer";
import Target from "../game/Target";
import {CacheType} from "../engine/Cache";

export default class Game extends Scene {
  private boulders: Boulder[] = []
  private targets: Target[] = []
  private dozer: Dozer|undefined
  private level: string = 'level-1'
  constructor (manager: SceneManager) {
    super(manager)
  }

  preload (level: string) {
    this.level = `level-${level}`
    this.load(this.level, `levels/${this.level}.json`, CacheType.JSON)
  }

  init (data: object) {
    debugger
    let levelData = this.cache.get(this.level)
  }
}