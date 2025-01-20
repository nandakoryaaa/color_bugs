function ReplayStateMoveBegin() {}

ReplayStateMoveBegin.prototype.update = function(player) {
	const move = player.moves[player.pos];
	if (move == 0) {
		return;
	}
	const pos = move & 255;
	const color = player.tiles[pos];
	player.view.addEffect(pos, new BounceEffect(color));
	player.state = new ReplayStateDelay(36, new ReplayStateMoveEnd());
};

