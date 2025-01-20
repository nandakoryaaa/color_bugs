function GameStatePath(color, dstPos) {
	this.color = color;
	this.dstPos = dstPos;
}

GameStatePath.prototype.update = function(game) {
	const pos = game.pathFinder.next();
	if (pos === this.dstPos) {
		game.view.addEffect(pos, new ClearEffect(this.color));
		game.state = new GameStateCheck();
	} else {
		game.view.addEffect(pos, new TrailEffect(this.color));
	}
};

