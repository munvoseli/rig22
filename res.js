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
	this.hook = {
		status: 0, // 0: not out, 1: thrown, 2: caught
		length: 0,
		pos: new Point(0,0),
		vel: new Point(0,0)
	};
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
		if (this.onGround)
			this.vel.x *= 0.8;
	}
	if (controls.up && this.onGround) {
		this.vel.y = -5;
	}
	if (controls.a) {
		if (this.hook.status == 0) {
			this.hook.pos.x = this.pos.x + 6;
			this.hook.pos.y = this.pos.y + 12;
			this.hook.vel.x = this.vel.x * 2;
			this.hook.vel.y = -10;
			this.hook.status = 1;
			controls.a = false;
		} else if (this.hook.status == 2) {
			this.hook.status = 0;
			controls.a = false;
		}
	}
	if (controls.b) {
		this.hook.length = (Math.sqrt(this.hook.length) - 1) ** 2;
	}
};

Res.prototype.tick = function(controls) {
	this.controlTick(controls);
	if (this.hook.status == 1) {
		this.hook.pos.addeq(this.hook.vel);
		let d = deDiscsPolygons([cD(this.hook.pos.x, this.hook.pos.y, 0)], wps)[0];
		if (d < 0) {
			this.hook.status = 2;
			this.hook.length = (this.hook.pos.x - this.pos.x - 6) ** 2 + (this.hook.pos.y - this.pos.y - 12) ** 2;
			this.vel.addeq(this.hook.pos.sub(this.pos).sub(new Point(6, 12)).norm());
		}
		this.hook.vel.y += 0.5;
	} else if (this.hook.status == 2) {
		let diff = this.pos.sub(this.hook.pos);
		diff.x += 6;
		diff.y += 12;
		let m = diff.mag2();
		if (m > this.hook.length) {
			//let diff2 = diff.norm().mul(this.hook.length);
			
			this.vel.addeq(diff.mul(Math.sqrt(this.hook.length / m) - 1));
		}
	}
};

Res.prototype.draw = function(ctx, camera) {
	if (this.hook.status != 0) {
		ctx.beginPath();
		ctx.moveTo(this.pos.x - camera.x + 6, this.pos.y - camera.y + 12);
		ctx.lineTo(this.hook.pos.x - camera.x, this.hook.pos.y - camera.y);
		ctx.stroke();
		ctx.closePath();
	}
	drawSpriteFacing(this.pos, sprites[2], this.faceRight, ctx, camera);
};
