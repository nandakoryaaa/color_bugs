function ReplayStatePending(nextState) {
	this.nextState = nextState;
}

ReplayStatePending.prototype.update = function(player) {
	if (player.view.effectCnt == 0) {
		player.state = this.nextState;
	}
};

