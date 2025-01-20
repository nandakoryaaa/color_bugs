function ReplayStateUpdateTiles(tiles) {
	this.tiles = tiles;
}

ReplayStateUpdateTiles.prototype.update = function(player) {
	const removedCnt = player.lineScanner.scanLines(player.tiles, player.lineLength);
	if (removedCnt) {
		const marks = player.lineScanner.getMarks();
		for (let pos = 0; pos < player.fieldSize; pos++) {
			if (marks[pos] !== 0) {
				const color = player.tiles[pos];
				player.tiles[pos] = 0;
				player.view.addEffect(pos, new ShakeEffect(color));
			}
		}
	}
	const nextState = new ReplayStateDelay(12, new ReplayStateMoveBegin());
	if (removedCnt) {
		player.state = new ReplayStatePending(nextState);
	} else {
		player.state = nextState;
	}
};
