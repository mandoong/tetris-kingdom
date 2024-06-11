import { UnitRenderer } from "./unit.js";
import { TetrisRenderer } from "./index.js";

const image1 = new Image();

image1.src = "./asset/unit/enemy/skeleton/Skeleton Walk.png";

const canvas = document.getElementById("tetris");
const width = 400;
const height = 800;
const padding = 100;
const map = new UnitRenderer({
  canvas,
  width: width + padding * 2,
  height: height + padding,
  padding: padding,
  images: {
    skeletonWalk: image1,
  },
});
const renderer = new TetrisRenderer(
  canvas,
  width,
  height,
  20,
  10,
  padding,
  () => {
    document.getElementById("message").style.display = "block";
  },
  () => {
    map.addUnit();
    console.log("good!");
  }
);
map.run();
renderer.run();
