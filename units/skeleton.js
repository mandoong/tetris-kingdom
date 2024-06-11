import { Unit, UnitImage } from "../unit.js";

const images = {
  walk: "./asset/unit/enemy/skeleton/Skeleton Walk.png",
  atk: "./asset/unit/enemy/skeleton/Skeleton Attack.png",
};

export const Skeleton = (x, y, canvas) => {
  return new Unit({
    health: 50,
    damage: 20,
    moveSpeed: 1,
    range: 10,
    positionX: x,
    positionY: y,
    atkSpeed: 120,
    currentPosition: 2,
    images: {
      walk: new UnitImage({
        image: images.walk,
        canvas: canvas,
        frame: 5,
        cut: 13,
        w: 30,
        h: 30,
      }),
      atk: new UnitImage({
        image: images.atk,
        canvas: canvas,
        frame: 5,
        cut: 18,
        w: 30,
        h: 30,
      }),
    },
  });
};
