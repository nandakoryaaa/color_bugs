/* global LoopedEffect */

function BounceEffect(color) {
	LoopedEffect.call(this, 1);
	this.color = color;
}

BounceEffect.prototype = Object.create(LoopedEffect.prototype);

BounceEffect.prototype.getValue = function() {
	const sinArg = this.tick / 24 * Math.PI * 2;
	if (this.tick > 23) {
		this.tick = 0;
	}
	return 5 * Math.sin(sinArg);
};
