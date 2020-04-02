import Rect from './Rect';
export default class Node {
  constructor() {
    this.left = null;
    this.right = null;
    this.rect = null;
    this.filled = false;
  }
  insert_rect(rect) {
    if (this.left != null) {
      // console.log('not left');
      return this.left.insert_rect(rect) || this.right.insert_rect(rect);
    }
    if (this.filled) {
      // console.log('filled');
      return null;
    }
    if (!rect.fits_in(this.rect)) {
      // console.log('not fits');
      return null;
    }
    if (rect.same_size_as(this.rect)) {
      // console.log('same size');
      this.filled = true;
      return this;
    }
    this.left = new Node();
    this.right = new Node();
    var width_diff = this.rect.w - rect.w;
    var height_diff = this.rect.h - rect.h;
    var me = this.rect;
    if (width_diff > height_diff) {
      // split literally into left and right, putting the rect on the left.
      this.left.rect = new Rect(me.x, me.y, rect.w, me.h);
      this.right.rect = new Rect(me.x + rect.w, me.y, me.w - rect.w, me.h);
    }
    else {
      // split into top and bottom, putting rect on top.
      this.left.rect = new Rect(me.x, me.y, me.w, rect.h);
      this.right.rect = new Rect(me.x, me.y + rect.h, me.w, me.h - rect.h);
    }
    return this.left.insert_rect(rect);
  }
}
