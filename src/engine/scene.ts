export default interface Scene {
  init? (): any
  load? (): any
  destroy? (): any
  update? (timestamp?: number, delta?: number): any
  render? (ctx: CanvasRenderingContext2D): any
}

