function GameStatePending(nextGameState) {
	this.nextGameState = nextGameState;
}

GameStatePending.prototype.update = function(game) {
	if (game.view.effectCnt == 0) {
		game.state = this.nextGameState;
	}
};

