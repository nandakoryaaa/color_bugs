
function PathFinder(w, h) {
	this.w = w;
	this.h = h;
	this.fieldSize = w * h;
	this.pos = 0;
	this.srcPos = 0;
	this.dstPos = 0;
	this.field = new Uint8Array(this.fieldSize);
	this.error = false;
}

PathFinder.prototype.checkTile = function(pos, offset, tiles) {
	const p = pos + offset;
	const limit = this.field[pos] + 1;
	if (
		this.field[p] > limit
		&& (tiles[p] === 0 || p === this.srcPos)
	) {
		this.field[p] = limit;
		return true;
	}
	
	return false;
};

PathFinder.prototype.findPath = function(srcPos, dstPos, tiles) {
	this.error = false;
	this.srcPos = srcPos;
	this.dstPos = dstPos;
	this.pos = srcPos;
	const field = this.field;
	field.fill(255);
	field[dstPos] = 0;
	let changed = true;
	while (changed) {
		changed = false;
		for (let y = 0; y < this.h; y++) {
			for (let x = 0; x < this.w; x++) {
				const pos = y * this.w + x;
				if (field[pos] === 255) {
					continue;
				}
				if (pos === srcPos) {
					return true;
				}
				let chgLeft = (x > 0) && this.checkTile(pos, -1, tiles);
				let chgRight = (x < this.w - 1) && this.checkTile(pos, 1, tiles);
				let chgUp = (y > 0) && this.checkTile(pos, -this.w, tiles);
				let chgDown = (y < this.h - 1) && this.checkTile(pos, this.w, tiles);
				changed = changed || chgLeft || chgRight || chgUp || chgDown;
			}
		}
	}
	return false;
};

PathFinder.prototype.hasNext = function() {
	return !this.error && this.pos !== this.dstPos;
};

PathFinder.prototype.hasError = function() {
	return this.error;
};

PathFinder.prototype.next = function() {
	const pos = this.pos;
	if (pos === this.dstPos) {
		return pos;
	}

	const field = this.field;
	const val = field[pos];
	const y = (pos / this.w) | 0;
	const x = pos % this.w;

	if (x > 0 && field[pos - 1] !== 255 && field[pos - 1] < val) {
		this.pos--;
		return pos;
	}
	if (x < this.w - 1 && field[pos + 1] !== 255 && field[pos + 1] < val) {
		this.pos++;
		return pos;
	}
	if (y > 0 && field[pos - this.w] !== 255 && field[pos - this.w] < val) {
		this.pos -= this.w;
		return pos;
	}
	if (y < this.h - 1 && field[pos + this.w] !== 255 && field[pos + this.w] < val) {
		this.pos += this.w;
		return pos;
	}

	this.error = true;
	return this.pos;
};

