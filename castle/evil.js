import { Castle } from "../unit";

export const EvilCastle = ({ recovery, health, x, y }) => {
  new Castle({
    recovery: recovery,
    health: health,
    x,
    y,
  });
};
