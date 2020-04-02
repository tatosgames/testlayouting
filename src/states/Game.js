/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import lang from '../lang';
import Node from './Node';
import Rect from './Rect';

export default class extends Phaser.State {
  init() { }
  preload() { }

  shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  iteration() {
    const asset = this.images.pop();
    if (asset) {
      const element = this.game.add.sprite(0, 0, asset);
      element.visible = false;
      var rect = new Rect(0, 0,
        element.width,
        element.height);

      var node = this.start_node.insert_rect(rect);
      if (node) {
        var r = node.rect;
        if (!r.spr) {
          r.spr = element;
          if (r.spr) r.spr.position.set(r.x, r.y);
          // console.log(element.frameName,r.x, r.y);
          element.visible = true;
          this.filled_area += r.w * r.h;
        } else {
          console.log(this.start_node);
          return;
        }
      } else {
        
        console.log(this.start_node);
      }
      if (Math.abs(this.total_area - this.filled_area) > this.total_area * 0.05) {
        this.game.time.events.add(this.g_delay, this.iteration, this);
      }
    }
  }

  create() {
    const imagesPath = ['50', '100', '150', '200'];
    const images = this.images = [];
    for (let i = 0; i < 60; i++) {
      images.push(imagesPath[0]);
    };
    for (let i = 0; i < 20; i++) {
      images.push(imagesPath[1]);
    };
    for (let i = 0; i < 10; i++) {
      images.push(imagesPath[2]);
    };
    for (let i = 0; i < 10; i++) {
      images.push(imagesPath[3]);
    };
    this.images = this.shuffle(images);

    const width = this.game.width;
    const height = this.game.height;
    this.total_area = width * height;
    this.filled_area = 0;

    this.start_node = new Node();
    this.start_node.rect = new Rect(0, 0, width, height);

    this.timeout_id = null;
    this.g_delay = 0;
    this.iteration();
    console.log(end);
  }

}
