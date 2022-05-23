let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let sprites = [];
let spriteLoadCount = 0;
let spriteFiles = ["scraper.png", "bg0.png"];
let gameInterval;

let scraper = {
	pos: new Point(0, 0),
	vel: new Point(1, 0)
};
let wps = [
	[new Point(0, 113), new Point(103, 113), new Point(208, 149), new Point(280, 149), new Point(320, 120)]
];
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
	let bp = scraper.pos.clone();
	for (let i = 0; i < 8; ++i) {
		scraper.pos.addeq(scraper.vel.mul(.125));
		let ds = [cD(scraper.pos.x + 20, scraper.pos.y + 60 - 7.5, 7.5)];
		let res = deDiscsPolygons(ds, wps);
		if (res[0] < 0 && res[2] != 0) {
			let waveborn = nmResPolygons(res, wps);
			scraper.pos.addeq(waveborn.mul(res[0]));
		}
	}
	scraper.vel = scraper.pos.sub(bp);
	scraper.vel.y += 0.25;
	//ctx.drawImage(sprites[1], 0, 0);
	ctx.putImageData(imda, 0, 0);
	ctx.drawImage(sprites[0], Math.round(scraper.pos.x), Math.round(scraper.pos.y));
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
