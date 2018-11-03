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
  BOULDER = 'boulder',
  DOZER = 'dozer',
  BLOCK = 'block',
  BRICK = 'brick',
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

enum ArrowKey {
  DOWN = 'ArrowDown',
  UP = 'ArrowUp',
  LEFT = 'ArrowLeft',
  RIGHT = 'ArrowRight'
}

export default class Game extends Scene {
  private boulders: Boulder[] = []
  private targets: Target[] = []
  private bricks: Sprite[] = []
  private dozer: Dozer
  private level: number = 1
  private mapName: string = `level-${this.level}`
  private size: Point = new Point(20, 12)
  private tileSize: number = 32
  private brickMap: Map<string, number> = new Map()
  private lastKeyPressed = {
    [Orientation.DOWN]: 0 as number,
    [Orientation.UP]: 0 as number,
    [Orientation.RIGHT]: 0 as number,
    [Orientation.LEFT]: 0 as number
  }

  constructor (manager: SceneManager) {
    super(manager)
    this.dozer = new Dozer(this.cache, new Point(0, 0), CacheKey.DOZER, Orientation.UP)
  }

  preload (level: number) {
    this.level = level
    this.mapName = `level-${this.level}`
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
    this.load(this.mapName, `levels/${this.mapName}.json`, CacheType.JSON)
  }

  init (data: object) {
    const levelData = this.cache.get(this.mapName) as LevelData
    if (levelData.size) {
      this.size = new Point(levelData.size[0], levelData.size[1])
    }
    this.resize({x: this.size.x * this.tileSize, y: this.size.y * this.tileSize})
    this.dozer.pos.x = levelData.dozer[0]
    this.dozer.pos.y = levelData.dozer[1]
    this.dozer.orientation = Orientation.UP
    this.boulders = levelData.boulders.map((p, i) => {
      return new Boulder(this.cache, new Point(p[0], p[1]), CacheKey.BOULDER)
    })
    this.targets = levelData.targets.map(p => {
      return new Target(this.cache, new Point(p[0], p[1]), CacheKey.TARGET)
    })
    let brickTypeMap = {
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
      this.brickMap.set('' + brick[0] + '-' + brick[1], this.bricks.length)
      this.bricks.push(new Sprite(this.cache, new Point(brick[0], brick[1]), brickTypeMap[brick[2]]))
    }
    this.input.mountKeyboard()
    // this.input.onKeyDown(this.move.bind(this))
    // this.input.onKeyHold(this.move.bind(this))
  }

  destroy () {
    this.bricks = []
    this.boulders = []
    this.targets = []
    this.brickMap.clear()
  }

  updateInput (timestamp: number) {
    const pos = this.dozer.pos
    const minHoldTime = 300
    const moveLogic = (key: ArrowKey, dir: Orientation) => {
      if (this.input.isKeyDown(key)) {
        let vec = {x: 0, y: 0}
        switch (dir) {
          case Orientation.UP:
            this.dozer.rotateUp()
            vec.y--
            break
          case Orientation.LEFT:
            this.dozer.rotateLeft()
            vec.x--
            break
          case Orientation.RIGHT:
            this.dozer.rotateRight()
            vec.x++
            break
          default:
            this.dozer.rotateDown()
            vec.y++
        }
        const isTimeToMove = this.lastKeyPressed[dir] === 0 || timestamp - this.lastKeyPressed[dir] > minHoldTime
        const boulder: boolean|Boulder = this.isValidMove(pos, vec)
        if (isTimeToMove && boulder) {
          switch (dir) {
            case Orientation.LEFT:
              this.dozer.left()
              if (typeof boulder === 'object') boulder.left()
              break
            case Orientation.RIGHT:
              this.dozer.right()
              if (typeof boulder === 'object') boulder.right()
              break
            case Orientation.DOWN:
              this.dozer.down()
              if (typeof boulder === 'object') boulder.down()
              break
            default:
              this.dozer.up()
              if (typeof boulder === 'object') boulder.up()
          }
        }
        if (this.lastKeyPressed[dir] === 0) {
          this.lastKeyPressed[dir] = timestamp
        }
      } else {
        this.lastKeyPressed[dir] = 0
      }
    }

    moveLogic(ArrowKey.DOWN, Orientation.DOWN)
    moveLogic(ArrowKey.LEFT, Orientation.LEFT)
    moveLogic(ArrowKey.RIGHT, Orientation.RIGHT)
    moveLogic(ArrowKey.UP, Orientation.UP)

  }

  isLevelComplete () {
    for (let target of this.targets) {
      if (!this.boulderAtPos(target.pos.x, target.pos.y)) {
        return false
      }
    }
    return true
  }

  update (delta: number, timestamp: number) {
    this.updateInput(timestamp)
    if (this.isLevelComplete()) {
      this.start('game', {
        loadData: this.level + 1
      })
    }
  }

  isValidMove (from: Point, delta: Point): boolean|Boulder {
    const toX =from.x + delta.x
    const toY = from.y + delta.y
    const dozerPosHash = `${toX}-${toY}`
    if (this.brickMap.has(dozerPosHash)) {
      return false
    } else {
      const boulder = this.boulderAtPos(toX, toY)
      if (boulder) {
        const boulderToX = from.x + 2 * delta.x
        const boulderToY = from.y + 2 * delta.y
        if (this.brickMap.has(`${boulderToX}-${boulderToY}`) || this.boulderAtPos(boulderToX, boulderToY)) {
          return false
        } else {
          return boulder
        }
      }
    }
    return true
  }

  boulderAtPos (x: number, y: number): Boulder|undefined {
    let i = this.boulders.length
    while (i--) {
      if (this.boulders[i].pos.x === x && this.boulders[i].pos.y === y) {
        return this.boulders[i]
      }
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