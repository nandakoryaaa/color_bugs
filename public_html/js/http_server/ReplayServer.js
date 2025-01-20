function ReplayServer(url) {
	this.asyncResponse = null;
	this.url = url;
}

ReplayServer.prototype.parseInitResponse = function(txt)
{
	this.asyncResponse = JSON.parse(txt);
};

ReplayServer.prototype.init = function(uid) {
	this.asyncResponse = null;
	const request = new XMLHttpRequest();
	const that = this;
	const fn = function() {
		that.parseInitResponse(this.responseText);
	};

	request.addEventListener('load', fn);
	request.open('GET', this.url + '?uid=' + uid);
	request.send();
};
