import Point from "../engine/Point";
import Cache from '../engine/Cache'

export default class Sprite {
  constructor (
    private cache: Cache,
    public pos: Point,
    public cacheKey: string
  ) {}

  up (step: number) {
    this.pos.y -= step
  }

  down (step: number) {
    this.pos.y += step
  }

  left (step: number) {
    this.pos.x -= step
  }

  right (step: number) {
    this.pos.x += step
  }

  render (ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.cache.get(this.cacheKey), this.pos.x * 32, this.pos.y * 32)
  }
}