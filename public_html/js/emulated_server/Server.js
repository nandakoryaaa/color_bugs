function Server(config) {
	this.config = config;
	this.fieldSize = config.w * config.h;
	this.tiles = new Uint8Array(this.fieldSize);
	this.score = 0;
	this.emptyTilesCache = new EmptyTilesCache(this.fieldSize);
	this.pathFinder = new PathFinder(config.w, config.h);
	this.lineScanner = new LineScanner(config.w, config.h);
	this.asyncResponse = null;
}

Server.prototype.addBall = function() {
	if (!this.emptyTilesCache.hasMore()) {
		return null;
	}
	const pos = this.emptyTilesCache.getRandomPosition();
	const color = (1 + Math.random() * this.config.colors) | 0;
	this.tiles[pos] = color;
	return new Ball(pos, color);
};

Server.prototype.removeBalls = function() {
	if (this.lineScanner.scanLines(this.tiles, this.config.lineLength)) {
		const marks = this.lineScanner.getMarks();
		let cnt = 0;
		for (let pos = 0; pos < this.fieldSize; pos++) {
			if (marks[pos] !== 0) {
				this.tiles[pos] = 0;
				cnt++;
			}
		}
		this.score += 2 * cnt * cnt - 20 * cnt + 60;
		return true;
	}
	return false;
};

Server.prototype.init = function() {
	this.asyncResponse = null;
	this.tiles.fill(0);
	this.score = 0;
	this.emptyTilesCache.setEmptyTiles(this.tiles);
	for (let i = 0; i < this.config.initialBalls; i++) {
		this.addBall();
	}

	return new InitResponse(
		this.config.w, this.config.h, this.config.colors,
		Array.from(this.tiles)
	);
};

Server.prototype.moveBallAsync = function(srcPos, dstPos) {
	let canContinue = true;
	const addedBalls = new Array(this.config.addedBalls);
	addedBalls.fill(null);

	const tiles = this.tiles;
	if (this.pathFinder.findPath(srcPos, dstPos, tiles)) {
		tiles[dstPos] = tiles[srcPos];
		tiles[srcPos] = 0;
		if (!this.removeBalls()) {
			this.emptyTilesCache.setEmptyTiles(this.tiles);
			for (let i = 0; i < this.config.addedBalls; i++) {
				const ball = this.addBall();
				if (ball === null) {
					break;
				}
				addedBalls[i] = ball;
			}
			if (!this.removeBalls() && !this.emptyTilesCache.hasMore()) {
				canContinue = false;
			}
		}
	}
	this.asyncResponse = new MoveResponse(
		addedBalls, Array.from(tiles), this.score, canContinue 
	);
};

Server.prototype.getAsyncResponse = function() {
	return this.asyncResponse;
};
		