import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config';

export default class extends Phaser.State {
  init() {
    this.stage.backgroundColor = '#EDEEC9'
  }

  preload() {
    this.load.image('50', './assets/images/50.jpg')
    this.load.image('100', './assets/images/100.jpg')
    this.load.image('150', './assets/images/150.jpg')
    this.load.image('200', './assets/images/200.jpg')
  }

  render() {
    this.state.start('Game2')
  }
}
