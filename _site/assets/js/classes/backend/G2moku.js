define(['AbstractG2moku', 'games', 'base64', 'prototype'], function(AbstractG2moku, games, base64, proto){
	var p = Class.create();
	// inherit from Person class:
	p.prototype = Object.extend(new AbstractG2moku(), {
		initHandlers: function(){
			//console.log('mapHeight' + g.mapHeight);
		},
		sockets: function(){
			
		},
		generateID: function(callback){
			if(this.getGameID() === false) {
				var genID = +new Date(),
					preGenerated = "",//g.players.length + genID;
					newGenerated = "";
				this.players.playing.each(function(e, i){
					preGenerated+= e.name + '"' + e.playingTile + "'";
				});
				preGenerated = base64.encode(genID + "." + preGenerated);
				for(var i = 0; newGenerated.length < 10 + (this.players.playing.length * this.players.playing.length); i+=this.players.playing.length) {
					if(i + 1 < preGenerated.length) newGenerated+=preGenerated.substring(i, i + 1);
				}
				newGenerated = newGenerated + "." + genID;
				//console.log(preGenerated);
				callback(newGenerated, genID);
			} else {
				callback(false, this.getGameID());
			}
		},
		initialize: function(){
			this.gameErrors = {
				gameMenu: []
			};
			this.initHandlers();
		}
	});
	return p;
});