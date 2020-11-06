var canvas = null;
var context = null;
var lastKeyPress = null;
var dir = 0; // 0 <= dir <= 3 (integer)
var pause = true;
var player = null;
var score = 0;
var wall = new Array();

var KEY_LEFT = 37,
		KEY_UP = 38,
		KEY_RIGHT = 39,
		KEY_DOWN = 40,
		KEY_ENTER = 13;

function saveKey(e) {
	lastKeyPress = e.which;
}

document.addEventListener('keydown', saveKey, false);

function Rectangle(x, y, width, height) {
	this.x = (x == null) ? 0 : x;
	this.y = (y == null) ? 0 : y;
	this.width = (width == null) ? 0 : width;
	this.height = (height == null) ? this.width : height;

	this.intersects = function (rect) {
	if (rect == null) {
		window.console.warn('Missing parameters on function intersects');
	} else {
		return (this.x < rect.x + rect.width &&
		this.x + this.width > rect.x &&
		this.y < rect.y + rect.height &&
		this.y + this.height > rect.y);
	}
	};

	this.fill = function (context) {
	if (context == null) {
		window.console.warn('Missing parameters on function fill');
	} else {
		context.fillRect(this.x, this.y, this.width, this.height);
	}
	};
}

function random(max) {
	return Math.floor(Math.random() * max);
}

function paint(context) {
	// Clean canvas
	context.fillStyle = '#f2f2f2';
	context.fillRect(0, 0, canvas.width, canvas.height);

	// Draw player
	context.fillStyle = '#115735';
	player.fill(context);

	// Draw food
	context.fillStyle = '#f00';
	food.fill(context);

	// Draw walls
	context.fillStyle = '#999';
	for (i = 0, l = wall.length; i < l; i += 1) {
		wall[i].fill(context);
	}
}

	// Draw score
	context.fillText('Score: ' + score, 0, 10);

	// Debug last key pressed
	context.fillStyle = '#000';
	//context.fillTeplayer.xt('Last Key Press: ' + lastKeyPress, 0, 20);
	
	// Draw pause
	if (pause) {
		context.textAlign = 'center';
		context.fillText('PAUSE', 150, 75);
		context.textAlign = 'left';
	}
}

function act() {
	if (!pause) {
		//Change Direction
		if (lastKeyPress === KEY_UP) {
			dir = 0;
		}
		if (lastKeyPress === KEY_RIGHT) {
			dir = 1;
		}
		if (lastKeyPress === KEY_DOWN) {
			dir = 2;
		}
		if (lastKeyPress === KEY_LEFT) {
			dir = 3;
		}

		//Move Rectangle
		if (dir === 0) {
			player.y -= 10;
		}
		if (dir === 1) {
			player.x += 10;
		}
		if (dir === 2) {
			player.y += 10;
		}
		if (dir === 3) {
			player.x -= 10;
		}

		//Out Screen
		if (player.x > canvas.width) {
			player.x = 0;
		}
		if (player.y > canvas.height) {
			player.y = 0;
		}
		if (player.x < 0) {
			player.x = canvas.width;
		}
		if (player.y < 0) {
			player.y = canvas.height;
		}
	}	
	
	// Pause/Unpause
	if (lastKeyPress === KEY_ENTER) {
		pause = !pause;
		lastKeyPress = null;
	}

	// Food Intersects
	if (player.intersects(food)) {
		score += 1;
		food.x = random(canvas.width / 10 - 1) * 10;
		food.y = random(canvas.height / 10 - 1) * 10;
	}

	// Wall Intersects
	for (i = 0, l = wall.length; i < l; i += 1) {
		// if food hits the wall, food is moved
		if (food.intersects(wall[i])) {
			food.x = random(canvas.width / 10 - 1) * 10;
			food.y = random(canvas.height / 10 - 1) * 10;
		}
	}
}

function repaint() {
	window.requestAnimationFrame(repaint);
	paint(context);
}

function run() {
	setTimeout(run, 50);
	act();
}

function init() {
	// Get canvas an context
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');

	// Create player and food
	player = new Rectangle(40, 40, 10, 10);
	food = new Rectangle(80, 80, 10, 10);

	// Create walls
	wall.push(new Rectangle(100, 50, 10, 10));
	wall.push(new Rectangle(100, 100, 10, 10));
	wall.push(new Rectangle(200, 50, 10, 10));
	wall.push(new Rectangle(200, 100, 10, 10));

	// Start game
	run();
	repaint();
}

window.addEventListener('load', init, false);
