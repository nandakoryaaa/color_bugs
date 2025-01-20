/* global Effect */

function RejectEffect() {
	Effect.call(this, 3, 6);
}

RejectEffect.prototype = Object.create(Effect.prototype);
