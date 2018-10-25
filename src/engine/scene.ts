export default abstract class Scene {
  init (): void {}
  load (): void {}
  destroy (): void {}
  update (timestamp?: number, delta?: number): void {}
  render (ctx: CanvasRenderingContext2D): void {}
}

