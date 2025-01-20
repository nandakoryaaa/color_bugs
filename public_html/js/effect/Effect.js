function Effect(delay, endTick) {
	this.tick = 0;
	this.endTick = endTick;
	this.delay = delay;
	this.delayCnt = 0;
}

Effect.prototype.getValue = function() {
	return this.tick;
};
	
Effect.prototype.update = function() {
	if (this.delayCnt === 0) {
		if (this.tick < this.endTick) {
			this.tick++;
			this.delayCnt = this.delay;
		} else {
			return false;
		}
	} else {
		this.delayCnt--;
	}
	return true;
};
