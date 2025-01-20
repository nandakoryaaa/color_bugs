function ReplayStateCheck() {}

ReplayStateCheck.prototype.update = function(player) {
	player.pos++;
	const hasAddedBalls = player.moves[player.pos] !== 0;
	if (hasAddedBalls) {
		for (let i = 0; i < player.addedBalls; i++) {
			const ball = player.moves[player.pos + i];
			if (ball !== 0) {
				player.addBall(ball);
			} else {
				break;
			}
		}
		player.pos += player.addedBalls;
	} else {
		player.pos++;
	}
	const nextState = new ReplayStateUpdateTiles(player.tiles);
	if (hasAddedBalls) {
		player.state = new ReplayStatePending(nextState);
	} else {
		player.state = nextState;
	}
};
