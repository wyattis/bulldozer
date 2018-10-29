import Engine from './engine/Engine'
import SceneManager from "./engine/SceneManager";
import Intro from './scenes/intro'
import Game from './scenes/game'

const dozer = new Engine('.container')
const scenes = new SceneManager(dozer)

scenes.add('intro', new Intro(scenes))
scenes.add('game', new Game(scenes))

scenes.start('intro')