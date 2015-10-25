define(function(require){
    require('prototype'); // Ensure Prototype is present
	
    return Class.create({
		initialize: function(interval, callback) {
			this.count = 0;
			this.callback = callback;
			this.interval = interval;
			this.startTimestamp = 0;
			this.startTimestamp = +new Date();
		},
		clear: function() {
			clearInterval(this.id);
		},
		id: setInterval(function(){
				this.count++;
				this.callback(t);
		}, this.interval);
	});
});