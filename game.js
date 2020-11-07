(function (window, undefined) {
	'use strict';
	var KEY_LEFT = 37,
		  KEY_UP = 38,
		  KEY_RIGHT = 39,
		  KEY_DOWN = 40,
		  KEY_ENTER = 13;

	var canvas = null;
	var context = null;
	var lastKeyPress = null;
	var pause = true;
	var dir = 0; // 0 <= dir <= 3 (integer)
	var score = 0;
	// var wall = [];
	var body = [];
	var food = null;
	var gameover = true;
	var iBody = new Image();
	var iFood = new Image();
	var aEat = new Audio();
	var aDie = new Audio();

	var lastUpdate = 0,
			FPS = 0,
			frames = 0,
			acumDelta = 0;

	function saveKey(e) {
		lastKeyPress = e.which;
	}

	document.addEventListener('keydown', saveKey, false);

	function Rectangle(x, y, width, height) {
		this.x = (x === undefined) ? 0 : x;
		this.y = (y === undefined) ? 0 : y;
		this.width = (width === undefined) ? 0 : width;
		this.height = (height === undefined) ? this.width : height;

		Rectangle.prototype.intersects = function (rect) {
			if (rect === undefined) {
				window.console.warn('Missing parameters on function intersects');
			} else {
				return (this.x < rect.x + rect.width &&
				this.x + this.width > rect.x &&
				this.y < rect.y + rect.height &&
				this.y + this.height > rect.y);
			}
		};

		Rectangle.prototype.fill = function (context) {
			if (context === undefined) {
				window.console.warn('Missing parameters on function fill');
			} else {
				context.fillRect(this.x, this.y, this.width, this.height);
			}
		};

		Rectangle.prototype.drawImage = function (context, img) {
			if (img === undefined) {
				window.console.warn('Missing parameters on function drawImage');
			} else {
				if (img.width) {
				context.drawImage(img, this.x, this.y);
				} else {
				context.strokeRect(this.x, this.y, this.width, this.height);
				}
			}
		};
	};

	function random(max) {
		return ~~(Math.random() * max);
	}

	function canPlayOgg() {
		var aud = new Audio();
		if (aud.canPlayType('audio/ogg').replace(/no/, '')) {
			return true;
		} else {
		return false;
		}
	};

	function reset() {
		score = 0;
		dir = 1;
		// Snake length equal to zero at the beginning of every game
		body.length = 0;
		body.push(new Rectangle(40, 40, 10, 10));
		body.push(new Rectangle(0, 0, 10, 10));
		body.push(new Rectangle(0, 0, 10, 10));
		// body[0].x = 40;
		// body[0].y = 40;
		food.x = random(canvas.width / 10 - 1) * 10;
		food.y = random(canvas.height / 10 - 1) * 10;
		gameover = false;
	}

	function paint(context) {
		// Clean canvas
		context.fillStyle = '#f2f2f2';
		context.fillRect(0, 0, canvas.width, canvas.height);

		// Draw player
		//context.fillStyle = '#115735';
		context.strokeStyle = '#115735';
		for (var i = 0; i < body.length; i++) {
			//body[i].fill(context);
			context.drawImage(iBody, body[i].x, body[i].y);
		}

		// Draw walls
		// context.fillStyle = '#999';
		// context.strokeStyle = '#999';
		// for (var i = 0; i < wall.lenght; i++) {
		// 	wall[i].fill(context);
		// }

		// Draw food
		// context.fillStyle = '#f00';
		// food.fill(context);
		context.strokeStyle = '#f00';
		food.drawImage(context, iFood);

		// Debug last key pressed
		context.fillStyle = '#000';
		//context.fillText('Last Key Press: ' + lastKeyPress, 0, 20);

		// Draw score
		context.fillText('Score: ' + score, 0, 10);
		
		// Draw pause
		if (pause) {
			context.textAlign = 'center';
			if (gameover) {
				context.fillText('GAME OVER', 150, 75);
			} else {
				context.fillText('PAUSE', 150, 75);
			}
			context.textAlign = 'left';
		}
		context.fillText('FPS: ' + FPS, 150, 10);
	}

	function act() {
		if (!pause) {
			// GameOver Reset
			if (gameover) {
				reset();
			}

			// Move Body
			for (var i = body.length - 1; i > 0; i--) {
				body[i].x = body[i - 1].x;
				body[i].y = body[i - 1].y;
			}

			// Change Direction
			if (lastKeyPress === KEY_UP && dir !== 2) {
				dir = 0;
			}
			if (lastKeyPress === KEY_RIGHT && dir !== 3) {
				dir = 1;
			}
			if (lastKeyPress === KEY_DOWN && dir !== 0) {
				dir = 2;
			}
			if (lastKeyPress === KEY_LEFT && dir !== 1) {
				dir = 3;
			}

			// Move Head
			if (dir === 0) {
				body[0].y -= 10;
			}
			if (dir === 1) {
				body[0].x += 10;
			}
			if (dir === 2) {
				body[0].y += 10;
			}
			if (dir === 3) {
				body[0].x -= 10;
			}

			// Out Screen
			if (body[0].x > canvas.width - body[0].width) {
				body[0].x = 0;
			}
			if (body[0].y > canvas.height - body[0].height) {
				body[0].y = 0;
			}
			if (body[0].x < 0) {
				body[0].x = canvas.width - body[0].width;
			}
			if (body[0].y < 0) {
				body[0].y = canvas.height - body[0].height;
			}

			// Wall Intersects
			// for (var i = 0; i < wall.length; i++) {
			// 	// if food hits a wall, food is moved
			// 	if (food.intersects(wall[i])) {
			// 		food.x = random(canvas.width / 10 - 1) * 10;
			// 		food.y = random(canvas.height / 10 - 1) * 10;
			// 	}
			// 	// if the player hits a wall, the game stops and it starts from the beginning
			// 	if (body[0].intersects(wall[i])) {
			// 		gameover = true;
			// 		pause = true;
			// 	}
			// }
			
			// Body Intersects
			for (var i = 2; i < body.length; i ++) {
				if (body[0].intersects(body[i])) {
					gameover = true;
					pause = true;
					aDie.play();
				}
			}

			// Food Intersects
			if (body[0].intersects(food)) {
				body.push(new Rectangle(food.x, food.y, 10, 10));
				score += 1;
				food.x = random(canvas.width / 10 - 1) * 10;
				food.y = random(canvas.height / 10 - 1) * 10;
				aEat.play();
			}
		}

		// Pause/Unpause
		if (lastKeyPress === KEY_ENTER) {
			pause = !pause;
			lastKeyPress = null;
		}
	}

	function repaint() {
		window.requestAnimationFrame(repaint);
		paint(context);
	}

	function run() {
		window.requestAnimationFrame(run);
		var now = Date.now();
		var deltaTime = (now - lastUpdate) / 1000;
		if (deltaTime > 1) {
			deltaTime = 0;
		}
		lastUpdate = now;
		frames += 1;
		acumDelta += deltaTime;
		if (acumDelta > 1) {
			FPS = frames;
			frames = 0;
			acumDelta -= 1;
		}
		act();
	}

	function init() {
		// Get canvas an context
		canvas = document.getElementById('canvas');
		context = canvas.getContext('2d');

		// Load assets
		iBody.src = 'assets/body.png';
		iFood.src = 'assets/fruit.png';
		if (canPlayOgg()) {
			aEat.src="assets/chomp.oga";
			aDie.src = 'assets/dies.oga';
			} else {
			aEat.src="assets/chomp.m4a";
			aDie.src = 'assets/dies.oga';
		}

		// Create food
		food = new Rectangle(80, 80, 10, 10);

		// Create walls
		// wall.push(new Rectangle(100, 50, 10, 10));
		// wall.push(new Rectangle(100, 100, 10, 10));
		// wall.push(new Rectangle(200, 50, 10, 10));
		// wall.push(new Rectangle(200, 100, 10, 10));

		// Start game
		run();
		repaint();
	}

	window.addEventListener('load', init, false);
}(window));
