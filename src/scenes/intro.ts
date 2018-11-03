import Scene, {SceneOptions} from "../engine/Scene";
import SceneManager from "../engine/SceneManager";

let intervalId: number
let i: number
const barHeight = 10
export default class Intro extends Scene {
  constructor (manager: SceneManager) {
    super(manager)
  }
  init () {
    i = 0
    intervalId = setInterval(() => {
      i++
      if (i > 10) {
        this.start('game', {
          loadData: 1
        })
      }
    }, 60)
  }
  destroy () {
    clearInterval(intervalId)
  }
  render (ctx: CanvasRenderingContext2D) {
    const centerY = ctx.canvas.height / 2
    ctx.fillRect(0, centerY - barHeight / 2, ctx.canvas.width * (i / 100), barHeight)
  }
}