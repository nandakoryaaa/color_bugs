function GameStateInput() {}

GameStateInput.prototype.update = function() {};

GameStateInput.prototype.process = function(game, pos) {
	const tiles = game.tiles;
	const color = tiles[pos];
	if (color === 0) {
		return false;
	}
	game.view.addEffect(pos, new BounceEffect(color));
	game.state = new GameStateTarget(pos);
};
