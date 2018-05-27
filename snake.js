function game() {
}

window.onload = function() {
  canvas = document.getElementById('snake');
  context = canvas.getContext('2d');
  setInterval(game, 100/15);
}
