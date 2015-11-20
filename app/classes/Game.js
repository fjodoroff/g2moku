define(['AbstractGame', 'prototype', 'G2moku', 'utils'], function(AbstractGame, proto, G2moku, utils){
	var game = (function(ag) {
		ag.initHandlers = function(){
			//console.log('mapHeight' + g.mapHeight);
		};
		ag.getStats = function(){//game statistics

		};
		ag.initialize =  function(data) {
			if(utils.isObject(data)) {
				this.tile = data.tile;
				this.timer = data.timer;
				if(data.gameID || data.g2moku.getGameID()) this.gameID = data.gameID || data.g2moku.getGameID();
				if(data.g2moku) this.g2moku = data.g2moku;
			}
			ag.initHandlers();
		};
		return ag;
	}(new AbstractGame() || {}));
	return Class.create(AbstractGame, game);
});