function isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}
function Timer(interval, callback) {
	this.count = 0;
	this.callback = callback;
	this.interval = interval;
	this.startTimestamp = 0;
	t = this;
	this.clear = function() {
		clearInterval(this.id);
	};
	this.initialize();
	return this;
}
Timer.prototype = {
	initialize: function() {
		this.startTimestamp = +new Date();
		this.id = setInterval(function(){
			t.count++;
			t.callback(t);
		}, this.interval);
	}
};