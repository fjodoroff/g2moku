define(['Timer', 'utils', 'prototype'], function(Timer, utils, proto){	
    return Class.create({
		initialize: function(data) {
			if(utils.isObject(data)) {				
				this.tile = data.tile;
				this.timer = data.timer;
				if(data.player) this.player = data.player;
			}
		}
	});
});