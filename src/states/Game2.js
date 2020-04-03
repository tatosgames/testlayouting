/* globals __DEV__ */
import Phaser from 'phaser'
import Node from '../objects/Node';
import Rect from '../objects/Rect';

export default class extends Phaser.State {
  init () { }
  preload () { }

  shuffle (array) {
    return array.sort(() => Math.random() - 0.5);
  }

  // Sorting and displaying algorithm
  iteration () {
    const asset = this.images.pop();
    if (asset) {
      const element = this.game.add.sprite(0, 0, asset);
      element.visible = false;
      const rect = new Rect(0, 0,
        element.width,
        element.height);

      const node = this.start_node.insertRect(rect);
      if (node) {
        const r = node.rect;
        if (!r.spr) {
          r.spr = element;
          r.spr.position.set(r.x, r.y);
          element.visible = true;
          this.filledArea += r.w * r.h;
        } else return;
      }
      if (Math.abs(this.total_area - this.filledArea) > this.total_area * 0.05) {
        this.iteration();
      }
    }
  }

  create () {
    // Populate with random image and shuffle it
    const imagesPath = ['50', '100', '150', '200'];
    const images = this.images = [];

    for (let i = 0; i < 20; i++) {
      images.push(imagesPath[0]);
      if (i < 20) images.push(imagesPath[1]);
      images.push(imagesPath[0]);
      if (i < 10) images.push(imagesPath[2]);
      images.push(imagesPath[0]);
      if (i < 10) images.push(imagesPath[3]);
    };
    this.images = this.shuffle(images);

    // Define the size of area
    const width = this.game.width;
    const height = this.game.height;
    this.total_area = width * height;
    this.filledArea = 0;

    this.start_node = new Node();
    this.start_node.rect = new Rect(0, 0, width, height);

    this.timeout_id = null;
    this.g_delay = 0;
    this.iteration();
  }
}
