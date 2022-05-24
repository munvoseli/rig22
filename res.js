function phymove(ths, discs, groundc) {
	let bp = ths.pos.clone();
	let rp = ths.pos.clone();
	ths.onGround = false;
	for (let i = 0; i < 8; ++i) {
		rp.addeq(ths.vel.mul(.125));
		for (let disc of discs) {
			disc.x += ths.vel.x * .125;
			disc.y += ths.vel.y * .125;
		}
		let res = deDiscsPolygons(discs, wps);
		if (res[0] < 0 && res[2] != 0) {
			let waveborn = nmResPolygons(res, wps);
			rp.addeq(waveborn.mul(res[0]));
			for (let disc of discs) {
				disc.x += waveborn.x * res[0];
				disc.y += waveborn.y * res[0];
			}
			if (waveborn.y > groundc) {
				ths.onGround = true;
			}
		}
	}
	ths.vel = rp.sub(bp);
	ths.pos = rp;
}

function drawSpriteFacing(pos, sprite, right, ctx, camera) {
	let x = Math.round(pos.x);
	let y = Math.round(pos.y);
	if (right) {
		ctx.translate(x + sprite.width - camera.x, y - camera.y);
		ctx.scale(-1, 1);
	} else {
		ctx.translate(x - camera.x, y - camera.y);
	}
	ctx.drawImage(sprite, 0, 0);
	ctx.setTransform(1,0,0,1,0,0);
}


function Res() {
	this.pos = new Point(30, 0);
	this.vel = new Point(0, 0);
	this.onGround = false;
	this.faceRight = true;
	this.right = true;
}

Res.prototype.move = function() {
	phymove(this, [cD(this.pos.x + 6, this.pos.y + 18, 6)], 0.5);
	this.vel.y += 0.25;
};

Res.prototype.controlTick = function(controls) {
	let power = this.onGround ? 0.5 : 0.1;
	let maxv = 2;
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
	} else {
		this.vel.x *= 0.8;
	}
	if (controls.up && this.onGround) {
		this.vel.y = -5;
	}
};

Res.prototype.draw = function(ctx, camera) {
	drawSpriteFacing(this.pos, sprites[2], this.faceRight, ctx, camera);
};
