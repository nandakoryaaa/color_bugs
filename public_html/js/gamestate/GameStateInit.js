function GameStateInit() {}

GameStateInit.prototype.update = function(game) {
	const response = game.getServerResponse();
	if (response) {
		game.score = 0;
		game.w = response.w;
		game.h = response.h;
		game.fieldSize = game.w * game.h;
		game.tiles = new Uint8Array(game.fieldSize);
		game.pathFinder = new PathFinder(game.w, game.h);
		game.view = new View(game.w, game.h, game.renderer, game.imgAssets);
		game.view.drawField();
		game.view.drawScore(game.score);
		game.view.createReplayLink(response.uid);
		for (let pos = 0; pos < game.fieldSize; pos++) {
			const color = response.tiles[pos];
			if (color > 0) {
				game.addBall(pos, color);
			}
		}
	
		game.state = new GameStateInput();
	}
};
