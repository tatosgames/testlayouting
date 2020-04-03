import Rect from './Rect';
export default class Node {
  constructor () {
    this.left = null;
    this.right = null;
    this.rect = null;
    this.filled = false;
  }

  insertRect (rect) {
    if (this.left != null) {
      return this.left.insertRect(rect) || this.right.insertRect(rect);
    }

    if (this.filled) return null;
    if (!rect.fitsIn(this.rect)) return null;

    if (rect.sameSizeAs(this.rect)) {
      this.filled = true;
      return this;
    }
    this.left = new Node();
    this.right = new Node();
    const widthDiff = this.rect.w - rect.w;
    const heightDiff = this.rect.h - rect.h;
    const me = this.rect;
    if (widthDiff > heightDiff) {
      // split literally into left and right, putting the rect on the left.
      this.left.rect = new Rect(me.x, me.y, rect.w, me.h);
      this.right.rect = new Rect(me.x + rect.w, me.y, me.w - rect.w, me.h);
    }
    else {
      // split into top and bottom, putting rect on top.
      this.left.rect = new Rect(me.x, me.y, me.w, rect.h);
      this.right.rect = new Rect(me.x, me.y + rect.h, me.w, me.h - rect.h);
    }
    return this.left.insertRect(rect);
  }
}
