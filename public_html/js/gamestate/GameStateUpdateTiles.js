function GameStateUpdateTiles(tiles) {
	this.tiles = tiles;
}

GameStateUpdateTiles.prototype.update = function(game) {
	for (let pos = 0; pos < game.fieldSize; pos++) {
		if (game.tiles[pos] !== this.tiles[pos]) {
			const color = game.tiles[pos];
			game.tiles[pos] = this.tiles[pos];
			if (game.tiles[pos] === 0) {
				game.view.addEffect(pos, new ShakeEffect(color));
			} else {
				game.view.addEffect(pos, new ClearEffect(game.tiles[pos]));
			}
		}
	}
	game.state = new GameStateInput();
};
