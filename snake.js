class Segment {
  constructor(x, y) {
    this.color = 'green';
    this.x = x;
    this.y = y;
  }

  draw(context, { x: tileSizeX, y: tileSizeY }) {
    context.fillStyle = this.color;
    context.fillRect(this.x * tileSizeX, this.y * tileSizeY, tileSizeX, tileSizeY);
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

  draw(context, tileSize) {
    this.segments.forEach((segment) => segment.draw(context, tileSize));
  }

  update() {
    const { nextSquare } = this;

    if (nextSquare) {
      this.segments.unshift(nextSquare);
      this.segments.pop();
    }
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
  }

  update() {
    this.player.update();
  }
}

window.onload = function() {
  window.game = new Game();
}
