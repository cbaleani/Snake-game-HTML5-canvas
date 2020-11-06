var canvas = null;
var context = null;
var x = 50;
var y = 50;


function paint(context) {
	//First drawing
	context.fillStyle = '#115735';
	context.fillRect(50, 50, 100, 60);
	//Clean the canvas before painting again
	context.fillStyle = '#f2f2f2';
	context.fillRect(0, 0, canvas.width, canvas.height);
  // Painting a green rectangule again
	context.fillStyle = '#115735';
	context.fillRect(x, y, 10, 10);
}

function act(){
	x += 2;
	if (x > canvas.width) {
		x = 0;
	}
}

function run() {
	window.requestAnimationFrame(run);
	act();
	paint(context);
}

function init() {
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	run();
}

window.addEventListener('load', init, false);
