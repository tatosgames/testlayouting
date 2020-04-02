export default class Rect {
  constructor(x, y, w, h, spr = null, isStart = false) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.isStart = isStart;
  }
  fits_in(outer) {
    // if (outer.h <= this.h) console.log(this);
    if (outer.w >= this.w && outer.h >= this.h) {
      // console.log(true);
      return true;
    } else {
      // console.log(false);
      return false;
    }
    // return outer.w >= this.w && outer.h >= this.h;
  }
  same_size_as(other) {
    return this.w == other.w && this.h == other.h;
  }
}
