
function EmptyTilesCache(fieldSize) {
	this.cnt = 0;
	this.fieldSize = fieldSize;
    this.positions = new Uint8Array(fieldSize);
}

EmptyTilesCache.prototype.setEmptyTiles = function(tiles) {
	this.cnt = 0;
	for (let i = 0; i < this.fieldSize; i++) {
    	if (tiles[i] === 0) {
        	this.positions[this.cnt++] = i;
        }
    }
	return this.cnt;
};	

EmptyTilesCache.prototype.hasMore = function() {
	return this.cnt > 0;
};

EmptyTilesCache.prototype.getRandomPosition = function() {
	if (this.cnt === 0) {
    	throw new Error('No more positions');
    }
   	const randIndex = Math.floor(Math.random() * this.cnt);
    const pos = this.positions[randIndex];
    this.cnt--;
    this.positions[randIndex] = this.positions[this.cnt];

    return pos;
};

