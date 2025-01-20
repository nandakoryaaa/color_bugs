function ReplayStateDelay(cnt, nextState) {
	this.cnt = cnt;
	this.nextState = nextState;
}

ReplayStateDelay.prototype.update = function(player) {
	if (!this.cnt) {
		player.state = this.nextState;
	}
	this.cnt--;
};
