
function LineScanner(w, h) {
	this.w = w;
	this.h = h;
	this.fieldSize = w * h;
	this.marks = new Uint8Array(this.fieldSize);
}

LineScanner.prototype.getMarks = function() {
	return this.marks;
};


LineScanner.prototype.countElements = function(tiles, pos, step, maxLength) {
	const color = tiles[pos];
	let cnt = 1;
	while (--maxLength > 0) {
		pos += step;
		if (tiles[pos] !== color) {
			break;
		}
		cnt++;
	}
	return cnt;
};

LineScanner.prototype.scanDirection = function(
	tiles, pos, step, maxLength, requiredCnt
) {
	if (maxLength > this.w) {
		maxLength = this.w;
	} else if (maxLength > this.h) {
		maxLength = this.h;
	}
	let result = 0;
	while (maxLength >= requiredCnt) {
		let cnt = this.countElements(tiles, pos, step, maxLength);
		if (tiles[pos] !== 0 && cnt >= requiredCnt) {
			result = 1;
			for (let i = 0; i < cnt; i++) {
				this.marks[pos + step * i] = 1;
			}
		}
		maxLength -= cnt;
		pos += cnt * step;
	}
	return result;
};

LineScanner.prototype.scanLines = function(tiles, requiredCnt) {
	this.marks.fill(0);
	return this.scanLinesRight(tiles, requiredCnt)
		+ this.scanLinesDown(tiles, requiredCnt)
		+ this.scanLinesRightUp(tiles, requiredCnt)
		+ this.scanLinesRightDown(tiles, requiredCnt);
};

LineScanner.prototype.scanLinesRight = function(tiles, requiredCnt) {
	let result = 0;
	for (let y = 0; y < this.h; y++) {
		result += this.scanDirection(tiles, y * this.w, 1, this.w, requiredCnt);
	}
	return result;
};

LineScanner.prototype.scanLinesDown = function(tiles, requiredCnt) {
	let result = 0;
	for (let x = 0; x < this.w; x++) {
		result += this.scanDirection(tiles, x, this.w, this.h, requiredCnt);
	}
	return result;
};

LineScanner.prototype.scanLinesRightUp = function(tiles, requiredCnt) {
	let result = 0;
	const step = -this.w + 1;
	for (let y = requiredCnt - 1; y < this.h; y++) {
		result += this.scanDirection(
			tiles, y * this.w, step, y + 1, requiredCnt
		);
	}
	for (let x = 1; x <= this.w - requiredCnt; x++) {
		result += this.scanDirection(
			tiles, (this.h - 1) * this.w + x, step, this.w - x, requiredCnt
		);
	}
	return result;
};

LineScanner.prototype.scanLinesRightDown = function(tiles, requiredCnt) {
	let result = 0;
	const step = this.w + 1;
	for (let y = 0; y <= this.h - requiredCnt; y++) {
		result += this.scanDirection(
			tiles, y * this.w, step, this.h - y, requiredCnt
		);
	}
	for (let x = 1; x < this.w - requiredCnt + 1; x++) {
		result += this.scanDirection(tiles, x, step, this.w - x, requiredCnt);
	}
	return result;
};
