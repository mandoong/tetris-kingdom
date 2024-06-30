export default class Tile {
  constructor({ image, tx, ty }) {
    const img = new Image();
    img.src = image;

    const _x = img.width / tx;
    const _y = img.height / ty;

    this.w = _x;
    this.h = _y;
    this.img = img;
  }

  draw(tx, ty, x, y, w, h, canvas) {
    const context = canvas.getContext("2d");

    context.drawImage(
      this.img,
      this.w * tx,
      this.h * ty,
      this.w,
      this.h,
      x,
      y,
      w,
      h
    );
  }
}
