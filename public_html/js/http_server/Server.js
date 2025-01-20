function Server(url) {
	this.asyncResponse = null;
	this.uid = null;
	this.url = url;
}

Server.prototype.parseInitResponse = function(txt)
{
	this.asyncResponse = JSON.parse(txt);
	this.uid = this.asyncResponse.uid;
};


Server.prototype.parseResponse = function(txt)
{
	this.asyncResponse = JSON.parse(txt);
};

Server.prototype.initAsync = function() {
	this.asyncResponse = null;
	const request = new XMLHttpRequest();
	const that = this;
	const fn = function() {
		that.parseInitResponse(this.responseText);
	};

	request.addEventListener('load', fn);
	request.open('GET', this.url);
	request.send();
};

Server.prototype.moveBallAsync = function(srcPos, dstPos) {
	this.asyncResponse = null;
	const request = new XMLHttpRequest();
	const that = this;
	const fn = function() {
		that.parseResponse(this.responseText);
	};
	request.addEventListener('load', fn);
	request.open(
		'GET', this.url + '?uid=' + this.uid + '&m=' + ((dstPos << 8) + srcPos)
	);
	request.send();
};
