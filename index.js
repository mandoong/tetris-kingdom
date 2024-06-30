const blockTypes = [
  [
    [1, 1],
    [1, 1],
  ],
  [[1, 1, 1, 1]],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [1, 1, 1],
    [1, 0, 0],
  ],
];

const typeToColor = {
  0: "./asset/tetris/red_block.png", // red
  1: "./asset/tetris/cyan_block.png", // orange
  2: "./asset/tetris/yellow_block.png", // y
  3: "./asset/tetris/green_block.png", // g
  4: "./asset/tetris/blue_block.png", // b
  5: "./asset/tetris/purple_block.png", // p
};

class Block {
  constructor(x, y, type = 0) {
    this.id = `${Date.now()}_${Math.random().toString(12)}`;
    this.x = x;
    this.y = y;

    const img = new Image();
    img.src = typeToColor[type];
    this.color = img;

    this.type = type;
    this.shape = blockTypes[type];
  }
}

function generateXRandomBlock(x) {
  return new Block(x, 0, Math.floor(Math.random() * blockTypes.length));
}

class TetrisRenderer {
  isEnd = false;

  constructor(
    canvas,
    width,
    height,
    rows = 20,
    cols = 10,
    padding,
    onEnd = () => {},
    clearBlock = () => {}
  ) {
    this.canvas = canvas;
    this.width = width;
    this.height = height;
    this.rows = rows;
    this.cols = cols;
    this.currentBlock = null;
    this.onEnd = onEnd;
    this.padding = padding;
    this.clearBlock = clearBlock;

    this.canvas.width = width + this.padding * 2;
    this.canvas.height = height + this.padding;
    this.dropInterval = 500;
    this.lastTime = Date.now();
    this.board = Array.from({ length: rows }, () => Array(cols).fill(null));

    window.addEventListener("keydown", this.handleKey.bind(this));
  }

  canPlaceBlock(block, dx, dy) {
    if (!block) return false;
    for (let y = 0; y < block.shape.length; y++) {
      for (let x = 0; x < block.shape[y].length; x++) {
        if (block.shape[y][x]) {
          const newX = block.x + x + dx;
          const newY = block.y + y + dy;

          if (
            newX < 0 ||
            newX >= this.cols ||
            newY < 0 ||
            newY >= this.rows ||
            this.board[newY][newX] !== null
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  rotateBlock(block) {
    const newShape = block.shape[0].map((val, index) =>
      block.shape.map((row) => row[index]).reverse()
    );
    const newBlock = new Block(block.x, block.y, block.type);
    newBlock.shape = newShape;
    if (this.canPlaceBlock(newBlock, 0, 0)) {
      block.shape = newShape;
    }
  }

  moveBlockDown() {
    if (this.currentBlock) {
      if (!this.canPlaceBlock(this.currentBlock, 0, 1)) {
        this.currentBlock.shape.forEach((row, y) => {
          row.forEach((cell, x) => {
            if (cell) {
              this.board[this.currentBlock.y + y][this.currentBlock.x + x] =
                this.currentBlock.color;
            }
          });
        });
        this.currentBlock = null;
      }

      if (this.canPlaceBlock(this.currentBlock, 0, 1)) {
        this.currentBlock.y++;
      }
    }
  }

  checkRows() {
    for (let y = 0; y < this.rows; y++) {
      if (this.board[y].every((cell) => cell !== null)) {
        this.clearBlock();
        this.board.splice(y, 1);
        this.board.unshift(Array(this.cols).fill(null));
      }
    }
  }

  run() {
    requestAnimationFrame((time) => {
      if (this.isEnd) {
        return;
      }

      const now = Date.now();
      const elapsed = now - this.lastTime;
      if (elapsed > this.dropInterval && this.board.length > 0) {
        if (this.currentBlock === null) {
          const newBlock = generateXRandomBlock(Math.floor(this.cols / 2));
          const isEnd = this.canPlaceBlock(newBlock, 0, 0);

          if (!isEnd) {
            this.isEnd = true;
            this.onEnd();
          } else {
            this.currentBlock = newBlock;
          }
        } else {
          this.moveBlockDown();
          this.lastTime = now;
        }
      }

      this.checkRows();
      this.render();
      this.run();
    });
  }

  render() {
    const context = this.canvas.getContext("2d");

    context.fillStyle = "rgb(30, 30, 50)";
    context.fillRect(this.padding, this.padding, this.width, this.height);

    context.strokeStyle = "rgb(100, 100, 100)";
    context.lineWidth = 1;
    for (let i = 0; i < this.rows; i++) {
      context.beginPath();
      context.moveTo(
        this.padding,
        (i * this.height) / this.rows + this.padding
      );
      context.lineTo(
        this.width + this.padding,
        (i * this.height) / this.rows + this.padding
      );
      context.stroke();
    }

    for (let i = 0; i < this.cols; i++) {
      context.beginPath();
      context.moveTo((i * this.width) / this.cols + this.padding, this.padding);
      context.lineTo(
        (i * this.width) / this.cols + this.padding,
        this.height + this.padding
      );
      context.stroke();
    }

    if (this.currentBlock) {
      this.currentBlock.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const _x =
              ((this.currentBlock.x + x) * this.width) / this.cols +
              this.padding;

            const _y =
              ((this.currentBlock.y + y) * this.height) / this.rows +
              this.padding;

            context.drawImage(
              this.currentBlock.color,
              _x,
              _y,
              this.width / this.cols,
              this.height / this.rows
            );
          }
        });
      });
    }

    this.board.filter(Boolean).forEach((color, y) => {
      this.board[y].forEach((color, x) => {
        if (color) {
          context.drawImage(
            color,
            (x * this.width) / this.cols + this.padding,
            (y * this.height) / this.rows + this.padding,
            this.width / this.cols,
            this.height / this.rows
          );
        }
      });
    });
  }

  handleKey(e) {
    if (e.code === "Space") {
      while (this.canPlaceBlock(this.currentBlock, 0, 1)) {
        this.currentBlock.y++;
      }
      return;
    }
    if (!this.currentBlock) return;

    switch (e.key) {
      case "ArrowUp":
        this.rotateBlock(this.currentBlock);
        break;
      case "ArrowLeft":
        if (this.canPlaceBlock(this.currentBlock, -1, 0)) {
          this.currentBlock.x--;
        }
        break;
      case "ArrowRight":
        if (this.canPlaceBlock(this.currentBlock, 1, 0)) {
          this.currentBlock.x++;
        }
        break;
      case "ArrowDown":
        if (this.canPlaceBlock(this.currentBlock, 0, 1)) {
          this.currentBlock.y++;
        }
        break;
    }
    this.render();
  }
}

export { TetrisRenderer };
