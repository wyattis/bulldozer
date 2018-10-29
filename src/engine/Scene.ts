import Engine, {LoadFunction, RenderFunction, ResizeFunction, UpdateFunction} from "./Engine";
import Cache from '../engine/Cache'
import SceneManager, {StartOptions} from "./SceneManager";

export interface SceneOptions {
  name?: string
  init? (this: Scene, data: any): any
  load? (this: Scene, data: any): any
  destroy? (this: Scene): any
  update?: UpdateFunction
  render?: RenderFunction
}

export default class Scene {

  protected load: LoadFunction
  protected resize: ResizeFunction
  protected cache: Cache

  constructor (public manager: SceneManager) {
    this.load = manager.engine.load.bind(manager.engine)
    this.resize = manager.engine.resize.bind(manager.engine)
    this.cache = manager.engine.cache
  }

  public init (data: any) {}
  public preload (data: any) {}
  public destroy () {}
  public update (timestamp?: number, delta?: number) {}
  public render (ctx: CanvasRenderingContext2D) {}

  public start (name: string, opts?: StartOptions) {
    this.manager.start(name, opts)
  }
}

