class Block {
  constructor(x, y, color) {
    this.color = color;
    this.x = x;
    this.y = y;
  }

  draw(context, { x: tileSizeX, y: tileSizeY }) {
    context.fillStyle = this.color;
    context.fillRect(this.x * tileSizeX, this.y * tileSizeY, tileSizeX, tileSizeY);
  }

  overlaps({ x, y }) {
    return this.x === x && this.y === y;
  }
}

class Food extends Block {
  constructor(x, y) {
    super(x, y, 'yellow');
  }

  static spawn(x, y) {
    return new Food(
      Math.floor(Math.random() * x),
      Math.floor(Math.random() * y)
    );
  }
}

class Segment extends Block {
  constructor(x, y) {
    super(x, y, 'green');
  }
}

class Player {
  constructor(x, y) {
    this.segments = [new Segment(x, y)];
  }

  get nextSquare() {
    const head = this.segments[0];

    switch(this.direction) {
      case 'up':
        return new Segment(head.x, head.y - 1);
      case 'down':
        return new Segment(head.x, head.y + 1);
      case 'left':
        return new Segment(head.x - 1, head.y);
      case 'right':
        return new Segment(head.x + 1, head.y);
    }
  }

  hasEaten({ x, y }) {
    console.log(x, y, this.x, this.y);
    return this.x === x && this.y === y;
  }

  draw(context, tileSize) {
    this.segments.forEach((segment) => segment.draw(context, tileSize));
  }

  update(food) {
    const { nextSquare } = this;

    if (nextSquare) {
      this.segments.unshift(nextSquare);

      if (nextSquare.overlaps(food)) {
        food.isEaten = true;
      } else {
        this.segments.pop();
      }
    }
  }

  eat({ x, y }) {
    return this.segments.unshift(new Segment(x, y));
  }

  handleInput({ key }) {
    if (key === 'ArrowUp' && this.direction !== 'down') {
      this.direction = 'up';
    }

    if (key === 'ArrowDown' && this.direction !== 'up') {
      this.direction = 'down';
    }

    if (key === 'ArrowLeft' && this.direction !== 'right') {
      this.direction = 'left';
    }

    if (key === 'ArrowRight' && this.direction !== 'left') {
      this.direction = 'right';
    }
  }
}

class Game {
  constructor() {
    const canvas = document.getElementById('snake');
    const context = canvas.getContext('2d');

    this.gridSize = { x: 40, y: 40 };
    this.tileSize = {
      x: canvas.width / this.gridSize.x,
      y: canvas.height / this.gridSize.y
    };

    this.player = new Player(this.gridSize.x / 2, this.gridSize.y / 2);
    this.food = Food.spawn(this.gridSize.x, this.gridSize.y);

    document.addEventListener('keydown', (e) => {
      this.player.handleInput(e);

      e.preventDefault();
      e.stopImmediatePropagation();
      return true;
    });

    setInterval(() => {
      this.update();
      this.draw(context);
    }, 120);
  }

  draw(context) {
    context.fillStyle = 'black';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    this.player.draw(context, this.tileSize);
    this.food.draw(context, this.tileSize);
  }

  update() {
    this.player.update(this.food);

    if (this.food.isEaten) {
      this.food = Food.spawn(this.gridSize.x, this.gridSize.y);
    }
  }
}

window.onload = function() {
  window.game = new Game();
}
