define(['AbstractGame', 'prototype', 'G2moku', 'utils'], function(AbstractGame, proto, G2moku, utils){
	var p = Class.create();
	// inherit from Person class:
	p.prototype = Object.extend(new AbstractGame(), {
		initHandlers: function(){
			//console.log('mapHeight' + g.mapHeight);
		},
		initialize: function(data) {
			if(utils.isObject(data)) {
				this.tile = data.tile;
				this.timer = data.timer;
				if(data.gameID) this.gameID = data.gameID;
				if(data.g2moku) this.g2moku = data.g2moku;
			}
			this.initHandlers();
		}
	});
	return p;
});
//	var game = (function(ag) {
//		ag.initHandlers = function(){
//			//console.log('mapHeight' + g.mapHeight);
//		};
//		ag.initialize =  function(data) {
//			if(utils.isObject(data)) {
//				this.tile = data.tile;
//				this.timer = data.timer;
//				if(data.gameID || data.g2moku.getGameID()) this.gameID = data.gameID || data.g2moku.getGameID();
//				if(data.g2moku) this.g2moku = data.g2moku;
//			}
//			ag.initHandlers();
//		};
//		return ag;
//	}(new AbstractGame() || {}));
//	return Class.create(AbstractGame, game);
//});