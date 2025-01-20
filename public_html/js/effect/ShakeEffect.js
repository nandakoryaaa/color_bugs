/* global Effect */

function ShakeEffect(color) {
	Effect.call(this, 3, 5);
	this.color = color;
}

ShakeEffect.prototype = Object.create(Effect.prototype);

ShakeEffect.prototype.getValue = function() {
	return 2 * (1 - (this.tick & 1) * 2);
};
