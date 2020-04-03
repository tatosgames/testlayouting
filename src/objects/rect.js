export default class Rect {
  constructor (x, y, w, h, spr = null, isStart = false) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.isStart = isStart;
  }

  fitsIn (outer) {
    // if (outer.h <= this.h) console.log(this);
    return outer.w >= this.w && outer.h >= this.h;
  }

  sameSizeAs (other) {
    return this.w === other.w && this.h === other.h;
  }
}
