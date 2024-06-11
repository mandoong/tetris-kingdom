import { Unit, UnitImage } from "../unit.js";

const images = {
  walk: "./asset/unit/user/soldier/Soldier-Walk.png",
  atk: "./asset/unit/user/soldier/Soldier-Attack01.png",
  wait: "./asset/unit/user/soldier/Soldier-Idle.png",
  death: "./asset/unit/user/soldier/Soldier-Death.png",
};

export const Soldier = (x, y, canvas) => {
  return new Unit({
    health: 100,
    damage: 20,
    moveSpeed: 5,
    range: 30,
    positionX: x,
    positionY: y,
    atkSpeed: 200,
    currentPosition: 1,
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
        frame: 8,
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
