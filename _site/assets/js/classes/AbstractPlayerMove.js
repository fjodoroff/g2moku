define(['Timer', 'utils', 'prototype'], function(Timer, utils, proto){
	//if (typeof window === 'undefined') {
	var base64 = require('base64');
	//}
	var apm = (function(pm) {
		pm.toJSON = function(){
			var json = {
				id: this.id,
				tile: this.tile,
				timer: this.timer
			};
			if(this.player) json.player = this.player.getJSON();
			return json;
		};
		pm.initialize = function(data) {
			if(utils.isObject(data)) {
				this.tile = data.tile;
				this.timer = data.timer;
				if(data.player) this.player = data.player;
			}
		};
		return pm;
	}(apm || {}));
	return Class.create(apm);
});