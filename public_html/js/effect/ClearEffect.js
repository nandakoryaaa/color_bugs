/* global Effect */

function ClearEffect(color) {
	Effect.call(this, 0, 0);
	this.color = color;
}

ClearEffect.prototype = Object.create(Effect.prototype);
