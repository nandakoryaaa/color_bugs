function ReplayStateInit() {}

ReplayStateInit.prototype.update = function(player) {
	const response = player.getServerResponse();
	if (response) {
		player.score = 0;
		player.w = response.w;
		player.h = response.h;
		player.initialBalls = response.initialBalls;
		player.addedBalls = response.addedBalls;
		player.lineLength = response.lineLength;
		player.moves = response.moves;
		player.fieldSize = player.w * player.h;
		player.tiles = new Uint8Array(player.fieldSize);
		player.tiles.fill(0);
		player.lineScanner = new LineScanner(player.w, player.h);
		player.pathFinder = new PathFinder(player.w, player.h);
		player.view = new View(player.w, player.h, player.renderer, player.imgAssets);
		player.view.drawField();
	
		for (let pos = 0; pos < player.initialBalls; pos++) {
			const ball = player.moves[pos];
			player.addBall(ball);
		}
		player.pos = player.initialBalls;
	
		player.state = new ReplayStatePending(new ReplayStateMoveBegin());
	}
};
