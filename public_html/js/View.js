/* global ClearEffect, BounceEffect, ShakeEffect, TrailEffect, GrowEffect, RejectEffect */

function View(w, h, renderer, assets) {
	this.renderer = renderer;
	this.assets = assets;
	this.fieldW = w;
	this.fieldH = h;
	this.fieldSize = w * h;
	this.w = w * View.TILE_W + (w - 1) * View.TILE_SPACING;
	this.posX = (renderer.w - this.w) >> 1;
	this.posY = (renderer.h - this.w) >> 1;
	this.stride = View.TILE_W + View.TILE_SPACING;
	this.effects = new Array(this.fieldSize);
	this.effects.fill(null);
	this.effectCnt = 0;
};

View.TILE_W = 48;
View.TILE_BORDER = 1;
View.TILE_SPACING = 2;
View.COLOR_BG = '#666666';
View.COLOR_BODY = '#aaaaaa';
View.COLOR_LIGHT = '#eeeeee';
View.COLOR_DARK = '#a0a0a0';

View.prototype.drawTileBack = function(x, y) {
	const b = View.TILE_BORDER;
	const w = View.TILE_W;
	this.renderer.fillRect(
		x + b, y + b, w - b * 2, w - b * 2, View.COLOR_BODY
	);
};

View.prototype.drawTile = function(x, y) {
	this.drawTileBack(x, y);
	const w = View.TILE_W;
	const b = View.TILE_BORDER;
	this.renderer.fillRect(x, y, w, b, View.COLOR_LIGHT);
    this.renderer.fillRect(x, y + b, b, w - b, View.COLOR_LIGHT);
    this.renderer.fillRect(x + b, y + w - b, w - b, b, View.COLOR_DARK);
    this.renderer.fillRect(x + w - b, y + b, b, w - b, View.COLOR_DARK);
};

View.prototype.drawField = function() {
	this.renderer.clear(View.COLOR_BG);
	let x = this.posX;
	let y = this.posY;
	for (let i = 0; i < this.fieldSize; i++) {
		this.drawTile(x, y);
		x += this.stride;
		if (x > this.posX + this.w) {
			x = this.posX;
			y += this.stride;
		}
	}
};

View.prototype.drawScore = function(score) {
	const scoreArray = [];
	scoreArray.push(score % 10);
	while (score > 9) {
		score = (score / 10) | 0;
		scoreArray.push(score % 10);
	}
	const scoreLength = scoreArray.length;
	const scoreY = this.posY - 50;
	let scoreX = this.posX + this.w - 22;
	this.renderer.fillRect(
		scoreX - (scoreLength - 1) * 22, scoreY,
		scoreLength * 22, 40, View.COLOR_BG
	);
	for (let i = 0; i < scoreLength; i++) {
		const digitX = scoreArray[i] * 22;
		this.renderer.drawImage(this.assets, digitX, 104, 22, 40, scoreX, scoreY);
		scoreX -= 22;
	}
};

View.prototype.drawNextColors = function(colors) {
	const x = this.posX + ((this.w - 36 * 3) >> 1) + 12;
	const y = this.posY - 36;
	this.renderer.fillRect(x, y, 36 * 3 - 24, 12, View.COLOR_BG);
	for (let i = 0; i < colors.length; i++) {
		this.renderer.drawImage(
			this.assets, (colors[i] - 1) * 36, 144, 12, 12,
			x + i * 36, y
		);
	}
};

View.prototype.addEffect = function(pos, effect) {
	this.effects[pos] = effect;
};

View.prototype.removeEffect = function(pos, color) {
	this.effects[pos] = new ClearEffect(color);
};

View.prototype.update = function(tiles) {
	this.processEffects(tiles);
};

View.prototype.processEffects = function(tiles) {
	this.effectCnt = 0;
	for (let pos = 0; pos < this.fieldSize; pos++) {
		const effect = this.effects[pos];
		if (effect === null) {
			continue;
		}
		if (effect instanceof ClearEffect) {
			this.processEffect(pos);
			this.effects[pos] = null;
		} else {
			const result = effect.update();
			if (!result) {
				this.removeEffect(pos, tiles[pos]);
			} else {
				this.effectCnt++;
				this.processEffect(pos);
			}
		}
	}
};

View.prototype.processEffect = function(pos) {
	const effect = this.effects[pos];
	const x = this.posX + (pos % this.fieldW) * this.stride;
	const y = this.posY + ((pos / this.fieldW) | 0) * this.stride;
	const val = effect.getValue();
	this.drawTileBack(x, y, this.tileTemplate);
	if (
		effect instanceof BounceEffect || effect instanceof ClearEffect
		|| effect instanceof ShakeEffect
	) {
		if (effect.color !== 0) {
			this.renderer.drawImage(
				this.assets, (effect.color - 1) * 36, 0, 36, 36, x + 6, y + 6 + val
			);
		}
	} else if (effect instanceof TrailEffect) {
		this.renderer.drawImage(this.assets, val * 36, 36, 36, 36, x + 6, y + 6);
	} else if (effect instanceof GrowEffect) {
		const size = 8 + (36 - 8) * val / effect.endTick;
		this.renderer.drawScaledImage(
			this.assets, (effect.color - 1) * 36, 0, 36, 36,
			x + 24 - size / 2, y + 24 - size / 2, size, size
		);
	} else if (effect instanceof RejectEffect) {
		this.renderer.drawImage(this.assets, val * 32, 72, 32, 32, x + 8, y + 8);
	}
};

// dirty hack to get replay link on page
View.prototype.createReplayLink = function(uid) {
	const el = document.getElementById('replay');
	el.innerHTML = '<a href="replay.html?uid=' + uid + '">' + uid + '</a>';
};