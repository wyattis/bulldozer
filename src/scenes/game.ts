import Scene from "../engine/Scene";
import SceneManager from "../engine/SceneManager";
import Boulder from "../game/Boulder";
import Dozer, {Orientation} from "../game/Dozer";
import Target from "../game/Target";
import {CacheType} from "../engine/Cache";
import Point from "../engine/Point";
import Sprite from "../game/Sprite";

enum BrickType {
  BRICK = 0,
  BLOCK = 1,
  CLOSED_DIAMOND = 2,
  OPEN_DIAMOND = 3,
  CIRCLE = 4,
  SPIRAL = 5,
  PLUS = 6,
  SQUARE = 7
}

export enum CacheKey {
  TARGET = 'target',
  BLOCK = 'block',
  BOULDER = 'boulder',
  BRICK = 'brick',
  DOZER = 'dozer',
  C_DIAMOND = 'cdiamond',
  CIRCLE = 'circle',
  O_DIAMOND = 'odiamond',
  PLUS = 'plus',
  SPIRAL = 'spiral',
  SQUARE = 'square'
}
interface LevelData {
  dozer: [number, number],
  bricks: [number, number, BrickType][],
  boulders: [number, number][],
  targets: [number, number][],
  size?: [number, number]
}

export default class Game extends Scene {
  private boulders: Boulder[] = []
  private targets: Target[] = []
  private bricks: Sprite[] = []
  private dozer: Dozer
  private level: string = 'level-1'
  private size: Point = new Point(20, 12)
  private tileSize: number = 32
  constructor (manager: SceneManager) {
    super(manager)
    this.dozer = new Dozer(this.cache, new Point(0, 0), CacheKey.DOZER, Orientation.UP)
  }

  preload (level: string) {
    this.level = `level-${level}`
    this.load(CacheKey.TARGET, 'images/sprites/target.png', CacheType.IMAGE)
    this.load(CacheKey.BOULDER, 'images/sprites/boulder.png', CacheType.IMAGE)
    this.load(CacheKey.BLOCK, 'images/sprites/block.png', CacheType.IMAGE)
    this.load(CacheKey.BRICK, 'images/sprites/brick.png', CacheType.IMAGE)
    this.load(CacheKey.DOZER, 'images/sprites/bulldozer.png', CacheType.IMAGE)
    this.load(CacheKey.C_DIAMOND, 'images/sprites/c_diamond.png', CacheType.IMAGE)
    this.load(CacheKey.CIRCLE, 'images/sprites/circle.png', CacheType.IMAGE)
    this.load(CacheKey.O_DIAMOND, 'images/sprites/o_diamond.png', CacheType.IMAGE)
    this.load(CacheKey.PLUS, 'images/sprites/plus.png', CacheType.IMAGE)
    this.load(CacheKey.PLUS, 'images/sprites/plus.png', CacheType.IMAGE)
    this.load(CacheKey.SPIRAL, 'images/sprites/spiral.png', CacheType.IMAGE)
    this.load(CacheKey.SQUARE, 'images/sprites/square.png', CacheType.IMAGE)
    this.load(this.level, `levels/${this.level}.json`, CacheType.JSON)
  }

  init (data: object) {
    const levelData = this.cache.get(this.level) as LevelData
    if (levelData.size) {
      this.size = new Point(levelData.size[0], levelData.size[1])
    }
    this.resize({x: this.size.x * this.tileSize, y: this.size.y * this.tileSize})
    this.dozer.pos.x = levelData.dozer[0]
    this.dozer.pos.y = levelData.dozer[1]
    this.dozer.orientation = Orientation.UP
    this.boulders = levelData.boulders.map(p => {
      return new Boulder(this.cache, new Point(p[0], p[1]), CacheKey.BOULDER)
    })
    this.targets = levelData.targets.map(p => {
      return new Target(this.cache, new Point(p[0], p[1]), CacheKey.TARGET)
    })
    let brickMap = {
      [BrickType.BLOCK]: CacheKey.BLOCK,
      [BrickType.BRICK]: CacheKey.BRICK,
      [BrickType.CIRCLE]: CacheKey.CIRCLE,
      [BrickType.CLOSED_DIAMOND]: CacheKey.C_DIAMOND,
      [BrickType.OPEN_DIAMOND]: CacheKey.O_DIAMOND,
      [BrickType.PLUS]: CacheKey.PLUS,
      [BrickType.SPIRAL]: CacheKey.SPIRAL,
      [BrickType.SQUARE]: CacheKey.SQUARE
    }
    for (let brick of levelData.bricks) {
      this.bricks.push(new Sprite(this.cache, new Point(brick[0], brick[1]), brickMap[brick[2]]))
    }
  }

  render (ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#519331'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    let i = this.boulders.length
    while (i--) {
      this.boulders[i].render(ctx)
    }
    i = this.bricks.length
    while (i--) {
      this.bricks[i].render(ctx)
    }
    i = this.targets.length
    while (i--) {
      this.targets[i].render(ctx)
    }
    this.dozer.render(ctx)
  }
}