define(['AbstractG2moku', 'games', 'base64', 'prototype'], function(AbstractG2moku, games, base64, proto){
	var g2 = (function(g) {
		g.initHandlers = function(){
			//console.log('mapHeight' + g.mapHeight);
		};
		g.sockets = function(){
			
		};
		g.generateID = function(callback){
			if(g.getGameID() === false) {
				var genID = +new Date(),
					preGenerated = "",//g.players.length + genID;
					newGenerated = "";
				g.players.playing.each(function(e, i){
					preGenerated+= e.name + '"' + e.playingTile + "'";
				});
				preGenerated = base64.encode(genID + "." + preGenerated);
				for(var i = 0; newGenerated.length < 10 + (g.players.playing.length * g.players.playing.length); i+=g.players.playing.length) {
					if(i + 1 < preGenerated.length) newGenerated+=preGenerated.substring(i, i + 1);
				}
				newGenerated = newGenerated + "." + genID;
				//console.log(preGenerated);
				callback(newGenerated, genID);
			} else {
				callback(false, g.getGameID());
			}
		};
		g.initialize = function(){
			this.gameErrors = {
				gameMenu: []
			};
			this.initHandlers();
		};		
		return g;
	}(new AbstractG2moku() || {})); 
	return Class.create(AbstractG2moku, g2);
});