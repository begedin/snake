class Game {
  constructor() {
    const canvas = document.getElementById('snake');
    const context = canvas.getContext('2d');

    setInterval(() => {
      this.update();
      this.draw(context);
    }, 120);
  }

  draw(context) {
    context.fillStyle = 'black';
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  }

  update() {

  }
}

window.onload = function() {
  window.game = new Game();
}
