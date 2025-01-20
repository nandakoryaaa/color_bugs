function LoopedEffect(delay) {
	this.tick = 0;
	this.delay = delay;
	this.delayCnt = 0;
}

LoopedEffect.prototype.getValue = function() {
	return this.tick;
};

LoopedEffect.prototype.update = function() {
	if (this.delayCnt === 0) {
		this.tick++;
		this.delayCnt = this.delay;
	} else {
		this.delayCnt--;
	}
	return true;
};
