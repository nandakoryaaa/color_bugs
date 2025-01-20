function CanvasRenderer(ctx, w, h) {
	this.w = w;
	this.h = h;
	this.ctx = ctx;
}

CanvasRenderer.prototype.clear = function(color) {
	this.fillRect(0, 0, this.w, this.h, color);
};

CanvasRenderer.prototype.fillRect = function (x, y, w, h, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, w, h);
};

CanvasRenderer.prototype.drawImage = function(
	asset, srcX, srcY, w, h, dstX, dstY
) {
	this.ctx.drawImage(asset, srcX, srcY, w, h, dstX, dstY, w, h);
};

CanvasRenderer.prototype.drawScaledImage = function(
	asset, srcX, srcY, w, h, dstX, dstY, dw, dh
) {
	this.ctx.drawImage(asset, srcX, srcY, w, h, dstX, dstY, dw, dh);
};
