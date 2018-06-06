# Snake in pure Javascript, no external dependencies

This repository servers as a simple guide/lesson on how to build a basic Snake game in Javascript, without using any external dependencies.

The master branch is the final state of the code and is served from gh-pages at https://begedin-code-for-talks.github.io/snake/, meaning the game can be played there.

Other than the master branch, there is six distinct separate branchs, each in order depicting a discrete step in the development process.

## 1-blank-canvas-js-css     

A default `index.html` containing a blank canvas. The file is linked to an external css which centers and stretches the canvas across the entire page, while maintaining a confortable set of margins both left and right. It is also linked to the only `.js` file for the game, which starts off with a function hooked to `window.onload`;

## 2-game-loop  

A `Game` class is added. The `window.onload` function creates a new instance of this game.

The `Game` class initializes the canvas and prepares things for the main game loop.

At an interval of 120 miliseconds, the game instance calls its own `update` and `draw` functions. Initially, the draw function just fills the canvas with a black color, while the update function does nothing.

## 3-human-controlled-player

Introduces the `Player` class.

The `Player` class is a represantation of the snake in the game. It consists of an array of segments where the segment at index 0 is the head of the snake.

The `Game` class 
- spawns the player at the centre of the canvas
- listens to keyboard events and passes the code of the pressed key to the player's `handleInput()` function
- calls the player's `.update()` function from its own `.update()` function.

The `Player` class
- in `.handleInput()` changes movement direction based on the key pressed, while following the rule that direction cannot be reversed (no left <-> right or up <-> down)
- in `.update()` moves the head based on the current direction. This is done by shifting a new segment at the top of the array, making that the new head, while the removing the segment at the end of the array, keeping the overall segment count. For now, this means the segment count is always kept at 0.
- in `.draw(context, tileSize)`, calls `.draw(context, tileSize)` on each of its segments. 

The `Segment` class

- has no update logic, only contains the `.draw(context, tileSize)` function

## 4-spawn-and-eat-food

Introduces the `Food` class

The `Food` class and the `Segment` class now both extend a new `Block` class, since both have basically identical behavior, with the only difference being their color.

The game now keeps a single food item spawned on the board.

In the game's `.update()` function, when the player is being updated, the current instance of food is passed into the player.

The player's `.update(food)` function now checks if the food item can be eaten. If so, it does not remove the tail upon moving and tags the food as eaten.

The game's `.update()` function then checks if the food is eaten and spawns a new unit using the static `Food.spawn(maxX, maxY)` function.

This means the player now finally grows in size.

## 5-game-over-state

The game's `.update()` function now calls `player.isDead(gridSize)`. If that turns out to be `true`, the state of the game is reset. A new player and food item are spawned.

The player's `isDead(gridSize)` function returns true if one of two conditions are met:

- the player's head is out of `gridSize` bounds
- the player's head is coliding with one of its other segments

## 6-score-board             

Some markup for holding the game's score is added to `index.html`.

A static `ScoreBoard` class is added.

At the end of the `.update()` function, the game uses `ScoreBoard.setScore()` to set the score the the value of `player.segments.length - 1`. That means the initial score is 0 and each eaten food item increases it by 1.

When the player is dead and the game is reset, the score is set back to 0.
