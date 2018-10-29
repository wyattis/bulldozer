import Point from "../engine/Point";

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
}