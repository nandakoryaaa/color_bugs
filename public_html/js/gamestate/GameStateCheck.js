function GameStateCheck() {}

GameStateCheck.prototype.update = function(game) {
	const response = game.getServerResponse();
	if (response !== null) {
		let addedBallsCnt = 0;
		for (let i = 0; i < response.addedBalls.length; i++) {
			const ball = response.addedBalls[i];
			if (ball !== null) {
				addedBallsCnt++;
				game.addBall(ball.pos, ball.color);
			} else {
				break;
			}
		}
		const score = response.score;
		if (score !== game.score) {
			game.view.drawScore(score);
			game.score = score;
		}
		
		game.view.drawNextColors(response.nextColors);
		const nextState = new GameStateUpdateTiles(response.tiles);
		//if (addedBallsCnt > 0) {
		//	game.state = new GameStatePending(nextState);
		//} else {
			game.state = nextState;
		//}
	}
};
