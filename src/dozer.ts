import Engine from './engine/engine'
import SceneManager from "./engine/scene-manager";

const dozer = new Engine('.container')
const scenes = new SceneManager(dozer)

scenes.add('intro', {
  init () {
    setTimeout(() => {
      scenes.start('menu')
    }, 2000)
  },
  render (ctx: CanvasRenderingContext2D) {
    ctx.fillText('INTRO', 100, 100)
  }
})
scenes.add('menu', {
  render (ctx: CanvasRenderingContext2D) {
    ctx.fillText('MENU', 100, 100)
  }
})

scenes.start('intro')