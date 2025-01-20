function ReplayStateMoveEnd() {}

ReplayStateMoveEnd.prototype.update = function(player) {
	const move = player.moves[player.pos];
	const srcPos = move & 255;
	const dstPos = move >> 8;
	const color = player.tiles[srcPos];

	player.tiles[srcPos] = 0;
	player.tiles[dstPos] = color;
	player.view.removeEffect(srcPos, 0);
	player.pathFinder.findPath(srcPos, dstPos, player.tiles)
	player.state = new ReplayStatePath(color, dstPos);
};
