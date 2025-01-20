/* global Effect */

function TrailEffect(color) {
	Effect.call(this, 3, 6);
	this.color = color;
}

TrailEffect.prototype = Object.create(Effect.prototype);
