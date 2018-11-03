export interface KeyboardCallback {
  (event: KeyboardEvent): any
}

export enum KeyEvents {
  KEY_DOWN,
  KEY_UP,
  KEY_HOLD
}

interface IEventEmitter {
  addEventListener (type: string, listener: Function): any
  removeEventListener (type: string, listener: Function): any
}

export default class Input {
  private callbacks = {
    [KeyEvents.KEY_DOWN]: [] as KeyboardCallback[],
    [KeyEvents.KEY_UP]: [] as KeyboardCallback[],
    [KeyEvents.KEY_HOLD]: [] as KeyboardCallback[]
  }

  private handlers = {
    [KeyEvents.KEY_UP]: false,
    [KeyEvents.KEY_DOWN]: false
  }

  private downKeys = new Set()

  constructor (private element: IEventEmitter = window) {
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  public isKeyUp (key: string) {
    return !this.downKeys.has(key)
  }

  public isKeyDown (key: string) {
    return this.downKeys.has(key)
  }

  public onKeyDown (cb: KeyboardCallback) {
    this.mountKeyDownHandler()
    this.callbacks[KeyEvents.KEY_DOWN].push(cb)
  }

  public onKeyUp (cb: KeyboardCallback) {
    this.mountKeyUpHandler()
    this.callbacks[KeyEvents.KEY_UP].push(cb)
  }

  public onKeyHold (cb: KeyboardCallback) {
    this.mountKeyDownHandler()
    this.mountKeyUpHandler()
    this.callbacks[KeyEvents.KEY_HOLD].push(cb)
  }

  public reset () {
    this.downKeys.clear()
    this.callbacks[KeyEvents.KEY_HOLD] = []
    this.callbacks[KeyEvents.KEY_UP] = []
    this.callbacks[KeyEvents.KEY_DOWN] = []
    this.dismountKeyDownHandler()
    this.dismountKeyUpHandler()
  }

  public mountKeyboard () {
    this.mountKeyUpHandler()
    this.mountKeyDownHandler()
  }

  private handleKeyDown (ev: KeyboardEvent) {
    if (this.downKeys.has(ev.key)) {
      let i = this.callbacks[KeyEvents.KEY_HOLD].length
      while (i--) {
        this.callbacks[KeyEvents.KEY_HOLD][i](ev)
      }
    } else {
      this.downKeys.add(ev.key)
      let i = this.callbacks[KeyEvents.KEY_DOWN].length
      while (i--) {
        this.callbacks[KeyEvents.KEY_DOWN][i](ev)
      }
    }
  }

  private handleKeyUp = (ev: KeyboardEvent) => {
    this.downKeys.delete(ev.key)
    let i = this.callbacks[KeyEvents.KEY_UP].length
    while (i--) {
      this.callbacks[KeyEvents.KEY_UP][i](ev)
    }
  }

  private mountKeyDownHandler () {
    if (!this.handlers[KeyEvents.KEY_DOWN]) {
      this.handlers[KeyEvents.KEY_DOWN] = true
      this.element.addEventListener('keydown', this.handleKeyDown)
    }
  }

  private mountKeyUpHandler () {
    if (!this.handlers[KeyEvents.KEY_UP]) {
      this.handlers[KeyEvents.KEY_UP] = true
      this.element.addEventListener('keyup', this.handleKeyUp)
    }
  }

  private dismountKeyDownHandler () {
    if (this.handlers[KeyEvents.KEY_DOWN]) {
      this.handlers[KeyEvents.KEY_DOWN] = false
      this.element.removeEventListener('keydown', this.handleKeyDown)
    }
  }

  private dismountKeyUpHandler () {
    if (this.handlers[KeyEvents.KEY_UP]) {
      this.handlers[KeyEvents.KEY_UP] = false
      this.element.removeEventListener('keyup', this.handleKeyUp)
    }
  }
}