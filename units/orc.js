import { Unit, UnitImage } from "../unit.js";

const images = {
  walk: "./asset/unit/enemy/orc/Orc-Walk.png",
  atk: "./asset/unit/enemy/orc/Orc-Attack01.png",
  wait: "./asset/unit/enemy/orc/Orc-Idle.png",
  death: "./asset/unit/enemy/orc/Orc-Death.png",
};

export const Orc = (x, y, canvas) => {
  return new Unit({
    health: 50,
    damage: 15,
    moveSpeed: 5,
    range: 30,
    positionX: x,
    positionY: y,
    atkSpeed: 60,
    currentPosition: 2,
    images: {
      walk: new UnitImage({
        image: images.walk,
        canvas: canvas,
        frame: 8,
        cut: 8,
        w: 150,
        h: 150,
      }),
      atk: new UnitImage({
        image: images.atk,
        canvas: canvas,
        frame: 5,
        cut: 6,
        w: 150,
        h: 150,
      }),
      wait: new UnitImage({
        image: images.wait,
        canvas: canvas,
        frame: 5,
        cut: 6,
        w: 150,
        h: 150,
      }),
      death: new UnitImage({
        image: images.death,
        canvas: canvas,
        frame: 5,
        cut: 4,
        w: 150,
        h: 150,
      }),
    },
  });
};
