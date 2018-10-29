import Sprite from "./Sprite";
import Point from "../engine/Point";
import Cache from '../engine/Cache'

export enum Orientation {UP, DOWN, RIGHT, LEFT}

export default class Dozer extends Sprite {
  constructor (cache: Cache, pos: Point, key: string, public orientation: number) {
    super(cache, pos, key)
  }

  up (step: number) {
    super.up(step)
    this.orientation = Orientation.UP
  }

  down (step: number) {
    super.down(step)
    this.orientation = Orientation.DOWN
  }

  right (step: number) {
    super.right(step)
    this.orientation = Orientation.RIGHT
  }

  left (step: number) {
    super.left(step)
    this.orientation = Orientation.LEFT
  }
}