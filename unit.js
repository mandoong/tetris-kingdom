import { EvilCastle } from "./castle/evil.js";
import { UserCastle } from "./castle/user.js";
import { mainMap } from "./tile/mainMap.js";
import Tile from "./tile/tile.js";
import { Orc } from "./units/orc.js";
import { Skeleton } from "./units/skeleton.js";
import { Soldier } from "./units/soldier.js";

class Unit {
  constructor({
    health = 0,
    moveSpeed = 1,
    damage = 0,
    atkSpeed = 1,
    range = 1,
    level = 0,
    positionX = 50,
    positionY = 900,
    currentPosition = 1,
    images = {},
  }) {
    this.health = health;
    this.totalHealth = health;
    this.moveSpeed = moveSpeed;
    this.damage = damage;
    this.atkSpeed = atkSpeed;
    this.range = range;
    this.position = {
      x: positionX,
      y: positionY,
    };
    this.alive = false;
    this.level = level;
    this.currentPosition = currentPosition;
    this.atkDelay = 0;
    this.target;
    this.images = images;
    this.status = "walk";
    this.isDeath = false;
    this.deathCount = 0;
  }

  move(x, y) {
    this.status = "walk";
    if (
      Math.abs(x - this.position.x) <= 2 &&
      Math.abs(y - this.position.y) <= 2
    ) {
      if (this.currentPosition < 3) return (this.currentPosition += 1);
    }
    if (this.position.x - x >= 0) {
      if (this.position.x - this.moveSpeed < x) this.position.x = x;
      else this.position.x -= this.moveSpeed;
    } else {
      if (this.position.x + this.moveSpeed >= x) this.position.x = x;
      else this.position.x += this.moveSpeed;
    }

    if (this.position.y - y >= 0) {
      if (this.position.y - this.moveSpeed < y) this.position.y = y;
      else this.position.y -= this.moveSpeed;
    } else {
      if (this.position.y + this.moveSpeed >= y) this.position.y = y;
      else this.position.y += this.moveSpeed;
    }
  }

  moveEnemy(x, y) {
    this.status = "walk";
    if (
      Math.abs(x - this.position.x) <= 2 &&
      Math.abs(y - this.position.y) <= 2
    ) {
      if (this.currentPosition > 0) return (this.currentPosition -= 1);
    }

    if (this.position.x - x >= 0) {
      if (this.position.x - this.moveSpeed < x) this.position.x = x;
      else this.position.x -= this.moveSpeed;
    } else {
      if (this.position.x + this.moveSpeed >= x) this.position.x = x;
      else this.position.x += this.moveSpeed;
    }

    if (this.position.y - y >= 0) {
      if (this.position.y - this.moveSpeed < y) this.position.y = y;
      else this.position.y -= this.moveSpeed;
    } else {
      if (this.position.y + this.moveSpeed >= y) this.position.y = y;
      else this.position.y += this.moveSpeed;
    }
  }

  atkTarget() {
    this.status = "wait";
    if (!this.target) return;
    if (this.target.health <= 0) {
      this.atkDelay = 0;
      this.target = null;
      return;
    }
    if (this.atkDelay < this.images.atk.cut * this.images.atk.frame) {
      this.status = "atk";
    }

    if (this.atkDelay === this.images.atk.cut * this.images.atk.frame) {
      this.target.health -= this.damage;
    }

    this.atkDelay += 1;
    this.atkDelay = this.atkDelay % this.atkSpeed;
  }

  death() {
    this.status = "death";
    this.deathCount += 1;

    if (this.deathCount >= this.images.death.cut * this.images.death.frame) {
      this.isDeath = true;
    }
  }

  render(timer, mirror) {
    if (this.status === "walk") {
      this.images.walk.render(this.position.x, this.position.y, timer, mirror);
    }

    if (this.status === "atk") {
      this.images.atk.render(
        this.position.x,
        this.position.y,
        this.atkDelay,
        mirror
      );
    }

    if (this.status === "wait") {
      this.images.wait.render(
        this.position.x,
        this.position.y,
        this.atkDelay,
        mirror
      );
    }

    if (this.status === "death") {
      this.images.death.render(
        this.position.x,
        this.position.y,
        this.deathCount,
        mirror
      );
    }
  }
}

class Castle {
  constructor({ health = 1000, recovery = 10, image, x, y }) {
    this.health = health;
    this.totalHealth = health;
    this.recovery = recovery;
    this.image = image;
    this.x = x;
    this.y = y;
  }

  hewathRecovery(timer) {
    if (timer % 100 === 0) {
      this.health += this.recovery;
    }
  }
}

class TileImage {
  constructor({ image, tx, ty, x, y }) {
    const img = new Image();
    img.src = image;

    const _x = img.width / tx;
    const _y = img.height / ty;

    this.x = _x * x;
    this.y = _y * y;
    this.w = _x;
    this.h = _y;
    this.image = img;
  }

  draw(x, y, w, h, canvas) {
    const context = canvas.getContext("2d");

    context.drawImage(this.image, this.x, this.y, this.w, this.h, x, y, w, h);
  }
}
class UnitImage {
  constructor({ image, frame, cut, canvas, w, h }) {
    const img = new Image();
    img.src = image;

    this.image = img;
    this.frame = frame;
    this.cut = cut;
    this.canvas = canvas;
    this.w = w;
    this.h = h;
  }

  render(x, y, renderCount, mirror = false) {
    const imageCount = Math.floor(renderCount / this.frame) % this.cut;
    const context = this.canvas.getContext("2d");

    const ratio = (this.h / this.image.height) * (this.image.width / this.cut);

    if (mirror) {
      context.save();
      context.translate(x, y); // 이미지 중심으로 이동
      context.scale(-1, 1); // x축 반전
      context.translate(-x, -y); // 원래 위치로 이동

      context.drawImage(
        this.image,
        (this.image.width / this.cut) * imageCount,
        0,
        this.image.width / this.cut,
        this.image.height,
        x - this.w / 2,
        y - this.h / 2,
        ratio,
        this.h
      );

      context.restore();
    } else {
      context.drawImage(
        this.image,
        (this.image.width / this.cut) * imageCount,
        0,
        this.image.width / this.cut,
        this.image.height,
        x - this.w / 2,
        y - this.h / 2,
        ratio,
        this.h
      );
    }
  }
}

class UnitRenderer {
  constructor({ canvas, width, height, padding, images }) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.padding = padding;
    this.mapPoint = {
      0: {
        x: Math.floor(this.padding / 2),
        y: this.height - this.padding,
      },
      1: {
        x: Math.floor(this.padding / 2),
        y: Math.floor(this.padding / 2),
      },
      2: {
        x: this.width - Math.floor(this.padding / 2),
        y: Math.floor(this.padding / 2),
      },
      3: {
        x: this.width - Math.floor(this.padding / 2),
        y: this.height - this.padding,
      },
    };

    this.units = [];
    this.enemies = [];
    this.timer = 0;
    this.images = images;
    this.renderCount = 0;
    this.castle = {};
    this.backgroud;
  }

  init() {
    this.castle.evil = EvilCastle({
      recovery: 1,
      x: this.mapPoint[3].x,
      y: this.mapPoint[3].y,
      health: 500,
    });
    this.castle.user = UserCastle({
      recovery: 1,
      x: this.mapPoint[0].x,
      y: this.mapPoint[0].y,
      health: 500,
    });

    this.backgroud = mainMap;
  }

  run() {
    if (this.timer % 600 === 0) {
      this.enemies.push(
        Orc(this.mapPoint[3].x, this.mapPoint[3].y, this.canvas)
      );
      // this.units.push(
      //   Soldier(this.mapPoint[0].x, this.mapPoint[0].y, this.canvas)
      // );
    }
    this.timer += 1;
    this.units.forEach((unit) => {
      if (unit.health <= 0) {
        return unit.death();
      }
      if (!unit?.target) {
        const target = this.enemies.find((e) => {
          return (
            Math.abs(e.position.x - unit.position.x) +
              Math.abs(e.position.y - unit.position.y) <=
              unit.range && e.health > 0
          );
        });

        if (target) unit.target = target;
        else {
          const c = this.castle.evil;
          if (
            Math.abs(this.mapPoint[3].x - unit.position.x) +
              Math.abs(this.mapPoint[3].y - unit.position.y) <=
              unit.range &&
            c.health > 0
          ) {
            unit.target = this.castle.evil;
          }
        }
      }

      if (unit.target) {
        unit.atkTarget();
      } else {
        const point = this.mapPoint[unit.currentPosition];
        unit.move(point.x, point.y);
      }
    });

    this.enemies.forEach((enemy) => {
      if (enemy.health <= 0) {
        return enemy.death();
      }

      if (!enemy?.target) {
        const target = this.units.find((e) => {
          return (
            Math.abs(e.position.x - enemy.position.x) +
              Math.abs(e.position.y - enemy.position.y) <=
              enemy.range && e.health > 0
          );
        });

        if (target) enemy.target = target;
        else {
          const c = this.castle.user;

          if (
            Math.abs(this.mapPoint[0].x - enemy.position.x) +
              Math.abs(this.mapPoint[0].y - enemy.position.y) <=
              enemy.range &&
            c.health > 0
          ) {
            enemy.target = this.castle.user;
          }
        }
      }

      if (enemy.target) {
        enemy.atkTarget();
      } else {
        const point = this.mapPoint[enemy.currentPosition];
        enemy.moveEnemy(point.x, point.y);
      }
    });
    this.units = this.units.filter((e) => !e.isDeath);
    this.enemies = this.enemies.filter((e) => !e.isDeath);

    this.render();

    requestAnimationFrame(() => this.run());
  }

  healthRender(unit) {
    const context = this.canvas.getContext("2d");
    context.fillStyle = "rgb(100, 100, 100)";
    context.fillRect(unit.position.x - 15, unit.position.y - 30, 30, 5);

    context.fillStyle = "rgb(255, 100, 100)";
    context.fillRect(
      unit.position.x - 15,
      unit.position.y - 30,
      Math.max(30 * (unit.health / unit.totalHealth), 0),
      5
    );
  }

  castleHealthRender(castle) {
    const context = this.canvas.getContext("2d");
    context.fillStyle = "rgb(100, 100, 100)";
    context.fillRect(castle.x - 30, castle.y, 60, 5);

    context.fillStyle = "rgb(255, 100, 100)";
    context.fillRect(
      castle.x - 30,
      castle.y,
      Math.max(60 * (castle.health / castle.totalHealth), 0),
      5
    );
  }

  render() {
    const context = this.canvas.getContext("2d");

    context.fillStyle = "rgb(150, 150, 150)";
    context.fillRect(0, 0, this.width, this.height);

    const w = Math.floor(this.canvas.width / 26);
    const h = Math.floor(this.canvas.height / 43);

    for (let i = 0; i < this.backgroud.tile.length; i++) {
      const line = this.backgroud.tile?.[i];

      line.forEach((e, j) => {
        const [y, x] = e;
        this.backgroud.image.draw(x, y, j * w, i * h, w, h, this.canvas);
      });
    }

    this.units.forEach((unit) => {
      if (!unit) return;
      unit.render(this.timer);
      this.healthRender(unit);
    });

    this.enemies.forEach((enemy) => {
      if (!enemy) return;
      enemy.render(this.timer, true);
      this.healthRender(enemy);
    });

    this.castle.user.image.draw(
      this.mapPoint[0].x - this.castle.evil.image.w,
      this.mapPoint[0].y,
      60,
      80,
      this.canvas
    );

    this.castleHealthRender(this.castle.user);

    this.castle.evil.image.draw(
      this.mapPoint[3].x - this.castle.evil.image.w,
      this.mapPoint[3].y,
      60,
      80,
      this.canvas
    );

    this.castleHealthRender(this.castle.evil);
  }

  addUnit(level, combo) {
    this.units.push(
      Soldier(this.mapPoint[0].x, this.mapPoint[0].y, this.canvas)
    );
  }
}

export { Unit, UnitImage, UnitRenderer, Castle, TileImage };
