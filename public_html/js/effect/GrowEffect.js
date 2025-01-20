/* global Effect */

function GrowEffect(color) {
	Effect.call(this, 1, 6);
	this.color = color;
}

GrowEffect.prototype = Object.create(Effect.prototype);
