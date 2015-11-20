define(['prototype', 'utils'], function(proto, utils){
    //require('prototype'); // Ensure Prototype is present
	
    return Class.create({
		toJSON: function(){
			var js = Object.keys(this);
			return js;
		},
		initialize: function(data) {
			if(utils.isObject(data)) {
				this.tile = data.tile;
				this.timer = data.timer;
				if(data.gameID) this.ID = data.gameID;
			}
		}
	});
});