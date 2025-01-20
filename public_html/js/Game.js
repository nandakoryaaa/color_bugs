function Game(server, renderer) {
	this.imgAssets = null;
	this.w = 0;
	this.h = 0;
	this.fieldSize = 0;
	this.tiles = null;
	this.score = 0;
	this.server = server;
	this.renderer = renderer;
	this.view = null;
	this.pathFinder = null;
	this.state = null;
};

Game.prototype.init = function() {
	this.server.initAsync();
	this.state = new GameStateInit();
};

Game.prototype.addBall = function(pos, color) {
	this.tiles[pos] = color;
	this.view.addEffect(pos, new GrowEffect(color));
};	

Game.prototype.moveBall = function(srcPos, dstPos) {
	this.server.moveBallAsync(srcPos, dstPos);
};

Game.prototype.getServerResponse = function() {
	return this.server.asyncResponse;
};

Game.prototype.update = function() {
	window.requestAnimationFrame(this.update.bind(this));
	if (this.view !== null) {
		this.view.update(this.tiles);
	}
	this.state.update(this);
};

