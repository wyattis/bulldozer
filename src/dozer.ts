import Engine from './engine/engine'

const dozer = new Engine('.container')

dozer.update(function (_, delta: number) {
  // console.log('update', delta)
})

dozer.render(function (ctx: CanvasRenderingContext2D) {
  ctx.fillRect(0, 0, 100, 100)
})

dozer.start()