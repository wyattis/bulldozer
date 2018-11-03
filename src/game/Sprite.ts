import Point from "../engine/Point";
import Cache from '../engine/Cache'

export default class Sprite {
  protected tileSize: number = 32
  protected angle: number = 0
  constructor (
    private cache: Cache,
    public pos: Point,
    public cacheKey: string
  ) {}

  up (step: number = 1) {
    this.pos.y -= step
  }

  down (step: number = 1) {
    this.pos.y += step
  }

  left (step: number = 1) {
    this.pos.x -= step
  }

  right (step: number = 1) {
    this.pos.x += step
  }

  render (ctx: CanvasRenderingContext2D) {
    const scale = 1
    ctx.setTransform(scale, 0, 0, scale, this.pos.x * this.tileSize + this.tileSize / 2, this.pos.y * this.tileSize + this.tileSize / 2); // sets scale and origin
    ctx.rotate(this.angle);
    ctx.drawImage(this.cache.get(this.cacheKey), -this.tileSize / 2, -this.tileSize / 2)
  }
}