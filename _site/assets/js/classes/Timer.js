define(['prototype'], function(proto){
    return Class.create({
		initialize: function(interval, callback) {
			this.count = 0;
			if(callback) this.callback = callback;
			this.interval = interval;
			this.startTimestamp = +new Date();
			this.endTimestamp = null;
			this.id = this.start();
		},
		getTimestampDiff: function(formated){
			var ret = 0;
			if(this.endTimestamp != null) ret = (this.endTimestamp - this.startTimestamp);
			else return false;
			if(formated) {
				var date = new Date(ret),
					minutes = "0" + date.getMinutes(),
					seconds = "0" + date.getSeconds(),
					milliseconds = "0" + date.getMilliseconds();
				ret = (minutes.substr(-2) == '00' ? '' : minutes.substr(-2) + ':') + seconds.substr(-2) + ":" + milliseconds.substr(-3);
			}
			return ret;
 		},
		clear: function() {
			this.endTimestamp = +new Date();
			clearInterval(this.id);
		},
		start: function(){
			var t = this;
			var id = setInterval(function(){
				t.count++;
				if(t.callback) t.callback(t);
			}, this.interval);
			return id;
		}
	});
});