import { Castle, TileImage } from "../unit.js";

const images = {
  stand: "./asset/tiles/map.png",
};

export const EvilCastle = ({ recovery, health, x, y }) => {
  return new Castle({
    recovery: recovery,
    health: health,
    x,
    y,
    image: new TileImage({
      image: images.stand,
      tx: 8,
      ty: 6,
      x: 7,
      y: 2,
    }),
  });
};
