function Replay(server, renderer) {
	this.imgAssets = null;
	this.w = 0;
	this.h = 0;
	this.initialBalls = 0;
	this.addedBalls = 0;
	this.lineLength = 0;
	this.fieldSize = 0;
	this.tiles = null;
	this.score = 0;
	this.server = server;
	this.renderer = renderer;
	this.view = null;
	this.pathFinder = null;
	this.state = null;
	this.moves = null;
	this.pos = 0;
};

Replay.prototype.init = function(uid) {
	this.server.init(uid);
	this.state = new ReplayStateInit();
};

Replay.prototype.addBall = function(ball) {
	const pos = ball >> 8;
	const color = ball & 255;
	this.tiles[pos] = color;
	this.view.addEffect(pos, new GrowEffect(color));
};	

Replay.prototype.getServerResponse = function() {
	return this.server.asyncResponse;
};

Replay.prototype.update = function() {
	window.requestAnimationFrame(this.update.bind(this));
	if (this.view !== null) {
		this.view.update(this.tiles);
	}
	this.state.update(this);
};

