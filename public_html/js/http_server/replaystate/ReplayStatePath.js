function ReplayStatePath(color, dstPos) {
	this.color = color;
	this.dstPos = dstPos;
}

ReplayStatePath.prototype.update = function(player) {
	const pos = player.pathFinder.next();
	if (player.pathFinder.hasError()) {
		console.log('pathfinder error');
		player.state = new ReplayStateError();
		return;
	}
	if (pos === this.dstPos) {
		player.view.addEffect(pos, new ClearEffect(this.color));
		player.state = new ReplayStateCheck();
	} else {
		player.view.addEffect(pos, new TrailEffect(this.color));
	}
};

