var canvas = null;
var context = null;
var lastKeyPress = null;
var x = 50;
var y = 50;
var dir = 0; // 0 <= dir <= 3 (integer)
var pause = true;

var KEY_LEFT = 37,
		KEY_UP = 38,
		KEY_RIGHT = 39,
		KEY_DOWN = 40,
		KEY_ENTER = 13;

function saveKey(e) {
	lastKeyPress = e.which;
}

document.addEventListener('keydown', saveKey, false);

function paint(context) {
	// First drawing
	// context.fillStyle = '#115735';
	// context.fillRect(50, 50, 100, 60);

	// Clean canvas
	context.fillStyle = '#f2f2f2';
	context.fillRect(0, 0, canvas.width, canvas.height);
  // Draw square
	context.fillStyle = '#115735';
	context.fillRect(x, y, 10, 10);
	// Debug last key pressed
	context.fillStyle = '#000';
	//context.fillText('Last Key Press: ' + lastKeyPress, 0, 20);
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
		if (lastKeyPress == KEY_UP) {
			dir = 0;
		}
		if (lastKeyPress == KEY_RIGHT) {
			dir = 1;
		}
		if (lastKeyPress == KEY_DOWN) {
			dir = 2;
		}
		if (lastKeyPress == KEY_LEFT) {
			dir = 3;
		}

		//Move Rectangle
		if (dir === 0) {
			y -= 10;
		}
		if (dir === 1) {
			x += 10;
		}
		if (dir === 2) {
			y += 10;
		}
		if (dir === 3) {
			x -= 10;
		}

		//Out Screen
		if (x > canvas.width) {
			x = 0;
		}
		if (y > canvas.height) {
			y = 0;
		}
		if (x < 0) {
			x = canvas.width;
		}
		if (y < 0) {
			y = canvas.height;
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
	setTimeout(run, 50);
	act();
}

function init() {
	// Get canvas an context
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');

	// Start game
	run();
	repaint();
}

window.addEventListener('load', init, false);
