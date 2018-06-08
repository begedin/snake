class Square {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw(context, squareSize) {
    context.fillRect(
      this.x * squareSize.x,
      this.y * squareSize.y,
      squareSize.x,
      squareSize.y
    )
  }

  overlaps(otherSquare) {
    return this.x === otherSquare.x && this.y === otherSquare.y;
  }

  static spawnRandom(maxX, maxY) {
    return new Square(
      Math.floor(Math.random() * maxX),
      Math.floor(Math.random() * maxY)
    );
  }
}

class Player {
  constructor(x, y) {
    this.squares = [new Square(x, y)];
  }

  get nextSquare() {
    const head = this.squares[0];

    switch(this.direction) {
      case 'up':
        return new Square(head.x, head.y - 1);
        break;
      case 'down':
        return new Square(head.x, head.y + 1);
        break;
      case 'left':
        return new Square(head.x - 1, head.y);
        break;
      case 'right':
        return new Square(head.x + 1, head.y);
        break;
    }
  }

  handleInput(e) {
    if (e.key === 'ArrowUp' && this.direction !== 'down') {
      this.direction = 'up';
    }

    if (e.key === 'ArrowDown' && this.direction !== 'up') {
      this.direction = 'down';
    }

    if (e.key === 'ArrowLeft' && this.direction !== 'right') {
      this.direction = 'left';
    }

    if (e.key === 'ArrowRight' && this.direction !== 'left') {
      this.direction = 'right';
    }
  }

  draw(context, squareSize) {
    this.squares.forEach((square) => square.draw(context, squareSize));
  }

  update(food, gridSize) {
    const nextSquare = this.nextSquare;

    if (nextSquare) {
      if (nextSquare.overlaps(food)) {
        this.squares.unshift(nextSquare);
        food.isEaten = true;
      } else {
        this.squares.unshift(nextSquare);
        this.squares.pop();
      }
    }

    const head = this.squares[0];
    if (head.x < 0 || head.y < 0 || head.x >= gridSize.x || head.y >= gridSize.y) {
      this.isDead = true;
    }

    const tail = this.squares.slice(1);
    if (tail.some((square) => square.overlaps(head))) {
      this.isDead = true;
    }
  }
}

class Game {
  constructor() {
    const canvas = document.getElementById('snake');
    const context = canvas.getContext('2d');

    const gridSize = { x: 20, y: 20 };
    const squareSize = {
      x: Math.floor(canvas.width / gridSize.x),
      y: Math.floor(canvas.height / gridSize.y)
    }

    this.reset(gridSize);

    window.addEventListener('keydown', (e) => {
      this.player.handleInput(e);
    });

    window.setInterval(() => {
      this.update(gridSize);
      this.draw(context, squareSize);
    }, 120);
  }

  update(gridSize) {
    this.player.update(this.food, gridSize);

    if (this.food.isEaten) {
      this.food = Square.spawnRandom(gridSize.x, gridSize.y);
    }

    if (this.player.isDead) {
      this.reset(gridSize);
    }

    document.getElementById('score').innerHTML = this.player.squares.length - 1;
  }

  draw(context, squareSize) {
    context.fillStyle = 'black';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    context.fillStyle = 'white';
    this.player.draw(context, squareSize);

    context.fillStyle = 'yellow';
    this.food.draw(context, squareSize);
  }

  reset(gridSize) {
    this.player = new Player(10, 10);
    this.food = Square.spawnRandom(gridSize.x, gridSize.y);
  }
}

window.onload = function() {
  window.game = new Game();
}
