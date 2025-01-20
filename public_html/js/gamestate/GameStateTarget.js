function GameStateTarget(srcPos) {
	this.srcPos = srcPos;
}

GameStateTarget.prototype.update = function() {};

GameStateTarget.prototype.process = function(game, pos) {
	const color = game.tiles[this.srcPos];

	if (pos === this.srcPos) {
		game.view.removeEffect(pos, color);
		game.state = new GameStateInput();
	} else if (game.tiles[pos] > 0) {
		game.view.removeEffect(this.srcPos, color);
		game.view.addEffect(pos, new BounceEffect(game.tiles[pos]));
		this.srcPos = pos;
	} else if (!game.pathFinder.findPath(this.srcPos, pos, game.tiles)) {
		game.view.addEffect(pos, new RejectEffect());
	} else {
		game.tiles[this.srcPos] = 0;
		game.tiles[pos] = color;
		game.view.removeEffect(this.srcPos, 0);
		game.moveBall(this.srcPos, pos);
		game.state = new GameStatePath(color, pos);
	}
};

