define(['require', 'Timer', 'utils'], function(require, Timer, utils){
    require('prototype'); // Ensure Prototype is present
	
    return Class.create({
		initialize: function(data) {
			if(isObject(data)) {				
				this.tile = data.tile;
				this.timer = data.timer;
				if(data.player) this.player = data.player;
			}
		}
	});
});