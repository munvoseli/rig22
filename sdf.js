'use strict';

function Point(x, y) {
	this.x = x;
	this.y = y;
}

function Disc(x, y, r) {
	this.x = x;
	this.y = y;
	this.r = r;
}

function cD(x, y, r) {
	return {x: x, y: y, r: r};
}

Point.prototype.addeq = function(p) {
	this.x += p.x;
	this.y += p.y;
};

Point.prototype.mag = function() {
	return Math.sqrt(this.mag2());
};

Point.prototype.mag2 = function() {
	return this.x ** 2 + this.y ** 2;
};

Point.prototype.normeq = function() {
	let d = Math.sqrt(this.x ** 2 + this.y ** 2);
	this.x /= d;
	this.y /= d;
};

Point.prototype.norm = function() {
	let d = Math.sqrt(this.x ** 2 + this.y ** 2);
	return new Point(this.x / d, this.y / d);
};

Point.prototype.sub = function(p) {
	return new Point(this.x - p.x, this.y - p.y);
};

Point.prototype.mul = function(z) {
	return new Point(this.x * z, this.y * z);
};

Point.prototype.clone = function() {
	return new Point(this.x, this.y);
};

function add2d(a, b) {
	return {x: a.x + b.x, y: a.y + b.y};
}

function dot2(a, b) {
	return a.x * b.x + a.y * b.y;
}

function clamp(x, a, b) {
	return x <= a ? a : x >= b ? b : x;
}

// https://iquilezles.org/articles/distfunctions2d/
function dePointPolygon(p, ps) {
	let d = (p.x - ps[0].x) ** 2 + (p.y - ps[0].y) ** 2;
	let s = 1;
	let mi = 1;
	for (let i = 1; i < ps.length; i++) {
		let j = i - 1;
		let ex = ps[j].x - ps[i].x;
		let ey = ps[j].y - ps[i].y;
		let wx = p.x - ps[i].x;
		let wy = p.y - ps[i].y;
		let r = clamp((wx * ex + wy * ey) / (ex * ex + ey * ey), 0, 1);
		let bx = wx - ex * r;
		let by = wy - ey * r;
		let bd = bx * bx + by * by;
		if (bd < d) {
			d = bd;
			mi = i;
			s = ex * wy - ey * wx > 0 ? 1 : -1;
		}
		//let b0 = p.y >= ps[i].y;
		//let b1 = p.y < ps[j].y;
		//let b2 = ex * wy > ey * wx;
		//if (b0 == b1 && b1 == b2) s *= -1;
	}
	//s = 1;
	return [s * Math.sqrt(d), mi];
}

function deDiscsPolygons(discs, polygons) {
	let mind = Infinity;
	let minpi = 0, minverti = 0;
	for (let disc of discs) {
		for (let pi = 0; pi < polygons.length; ++pi) {
			let res = dePointPolygon(disc, polygons[pi]);
			let d = res[0] - disc.r;
			if (d < mind) {
				mind = d;
				minpi = pi;
				minverti = res[1];
			}
		}
	}
	return [mind, minpi, minverti];
}

function nmResPolygons(res, polygons) {
	let polygon = polygons[res[1]];
	if (res[2] == 0) console.warn("noooo");
	let p0 = polygon[res[2] - 1];
	let p2 = polygon[res[2]];
	let dx = p0.y - p2.y;
	let dy = p2.x - p0.x;
	let norm = Math.sqrt(dx * dx + dy * dy);
	return new Point(dx / norm, dy / norm);
}

function testDePointPolygon() {
	let ps = [new Point(0, 0), new Point(1, 0), new Point(0, 1)];
	console.log(0, dePointPolygon(new Point(0, 0), ps));
	console.log(0, dePointPolygon(new Point(1, 0), ps));
	console.log(0, dePointPolygon(new Point(0, 1), ps));
	console.log(.707, dePointPolygon(new Point(1, 1), ps));
	console.log("-.??", dePointPolygon(new Point(0, .5), ps));
}

