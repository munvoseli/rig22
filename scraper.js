
function Scraper() {
	this.pos = new Point(30, 0);
	this.vel = new Point(0, 0);
	this.onGround = false;
	this.faceRight = true;
	this.right = true;
}

Scraper.prototype.move = function() {
	phymove(this, [
			cD(this.pos.x + (this.faceRight ? 18 : 22), this.pos.y + 52.5, 7.5),
			cD(this.pos.x + (this.faceRight ? 10 : 30), this.pos.y + 30, 7.5),
	], 0);
	// let bp = this.pos.clone();
	// this.onGround = false;
	// for (let i = 0; i < 8; ++i) {
	// 	this.pos.addeq(this.vel.mul(.125));
	// 	let ds = [
	// 		cD(this.pos.x + (this.faceRight ? 18 : 22), this.pos.y + 52.5, 7.5),
	// 		cD(this.pos.x + (this.faceRight ? 10 : 30), this.pos.y + 30, 7.5),
	// 	];
	// 	let res = deDiscsPolygons(ds, wps);
	// 	if (res[0] < 0 && res[2] != 0) {
	// 		let waveborn = nmResPolygons(res, wps);
	// 		this.pos.addeq(waveborn.mul(res[0]));
	// 		this.onGround = true;
	// 	}
	// }
	// this.vel = this.pos.sub(bp);
	this.vel.y += 0.25;
};

Scraper.prototype.controlTick = function(controls) {
	let power = this.onGround ? 1 : 0.1;
	let maxv = 3;
	if (controls.right) {
		this.faceRight = this.right;
		if (this.vel.x < maxv - power)
			this.vel.x += power;
		else if (this.vel.x < maxv)
			this.vel.x = maxv;
	} else if (controls.left) {
		this.faceRight = !this.right;
		if (this.vel.x > -maxv + power)
			this.vel.x -= power;
		else if (this.vel.x > -maxv)
			this.vel.x = -maxv;
	}
};

Scraper.prototype.draw = function(ctx, camera) {
	drawSpriteFacing(this.pos, sprites[0], this.faceRight, ctx, camera);
};
