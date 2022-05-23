let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let sprites = [];
let spriteLoadCount = 0;
let spriteFiles = ["scraper.png", "bg0.png"];
let gameInterval;

let scraper = new Scraper();
let wps = [
	[new Point(0, 113), new Point(103, 113), new Point(208, 149), new Point(254, 149), new Point(275, 102), new Point(320, 96)]
];
let controls = {
	up: 0,
	down: 0,
	left: 0,
	right: 0,
};
function testBoi() {
	console.log(dePointPolygon(new Point(20, 113), wps[0]));
	console.log(deDiscsPolygons([cD(20, 113, 0)], wps));
	console.log(deDiscsPolygons([cD(20, 83, 30)], wps));
	console.log(dePointPolygon(new Point(20, 110), wps[0]));
	console.log(deDiscsPolygons([cD(20, 110, 0)], wps));
	console.log(deDiscsPolygons([cD(20, 80, 30)], wps));
	console.log(dePointPolygon(new Point(20, 126), wps[0]));
	console.log(deDiscsPolygons([cD(20, 126, 0)], wps));
	console.log(deDiscsPolygons([cD(20, 96, 30)], wps));
}

function generateDistImdata() {
	let imda = new ImageData(canvas.width, canvas.height);
	let i = 0;
	for (let y = 0; y < canvas.height; ++y) {
		for (let x = 0; x < canvas.width; ++x) {
			let res = deDiscsPolygons([cD(x, y, 0)], wps);
			let l = res[0] * 0.5;
			if (l < 0) {
				l *= -1;
				imda.data[i++] = 255 * clamp(l, 0, 1);
				imda.data[i++] = 128 * clamp(l, 0, 1);
				imda.data[i++] = 0;
			} else {
				imda.data[i++] = 0;
				imda.data[i++] = 127 * clamp(l, 0, 1);
				imda.data[i++] = 255 * clamp(l, 0, 1);
			}
			imda.data[i++] = 255;
		}
	}
	return imda;
}

let imda = generateDistImdata();

//testBoi();

function gameStep() {
	//console.log(res[0]);
	scraper.move(controls);
	ctx.drawImage(sprites[1], 0, 0);
	//ctx.putImageData(imda, 0, 0);
	scraper.draw(ctx);
}

function gameStart() {
	gameInterval = setInterval(gameStep, 1000 / 30);
}

function spriteOnload() {
	++spriteLoadCount;
	if (spriteLoadCount == spriteFiles.length) {
		gameStart();
	}
}

for (let s of spriteFiles) {
	let im = new Image();
	im.onload = spriteOnload;
	im.src = s;
	sprites.push(im);
}

canvas.addEventListener("click", function(e) {
	let rect = canvas.getBoundingClientRect();
	let x = (e.clientX - rect.x) * canvas.width / rect.width;
	let y = (e.clientY - rect.y) * canvas.height / rect.height;
	console.log(x, y);
}, false);

function keyHandler(e, b) {
	if (e.key == "ArrowUp") {
		controls.up = b;
	} else if (e.key == "ArrowDown") {
		controls.down = b;
	} else if (e.key == "ArrowLeft") {
		controls.left = b;
	} else if (e.key == "ArrowRight") {
		controls.right = b;
	}
}

addEventListener("keydown", function(e) {
	keyHandler(e, true);
}, false);

addEventListener("keyup", function(e) {
	keyHandler(e, false);
}, false);
