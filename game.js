var canvas = null,
context = null;

function paint(context) {
	context.fillStyle = '#115735';
	context.fillRect(50, 50, 100, 60);
}

function init() {
	canvas = document.getElementById('canvas');
	context = canvas.getContext('2d');
	paint(context);
}
window.addEventListener('load', init, false);
