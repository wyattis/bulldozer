import Sprite from "./Sprite";
import Point from "../engine/Point";
import Cache from '../engine/Cache'
import {DEGREES_TO_RADIANS} from "../engine/M";

export enum Orientation {UP, DOWN, RIGHT, LEFT}

export default class Dozer extends Sprite {
  constructor (cache: Cache, pos: Point, key: string, public orientation: number) {
    super(cache, pos, key)
  }

  rotateUp () {
    this.angle = DEGREES_TO_RADIANS * 180
  }

  rotateDown () {
    this.angle = 0
  }

  rotateRight () {
    this.angle = DEGREES_TO_RADIANS * -90
  }

  rotateLeft () {
    this.angle = DEGREES_TO_RADIANS * 90
  }

}