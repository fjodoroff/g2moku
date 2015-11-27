define(['Game'], function(Game) {
	var games = function(group) {
		this.games = {};
		this.group = group;
		this.sendGamesStats = function(req){
			var gameStats = {
					games: {}
				},
				gameKeys = Object.keys(this.games[group]);
			for(var i = 0; i < gameKeys.length; i++){
				var e = this.games[group][gameKeys[i]];
				gameStats.games[gameKeys[i]] = e.getStats();
				//e.g2moku.getPlaying()
			}
			global.log.logResponse(["Broadcast", "Everyone"], "sendGameStats | " + JSON.stringify(gameStats));
			req.io.broadcast('sendGamesStats', gameStats);
		};
		//this.toJSON = function(){
		//	var gameKeys = Object.keys(global.games[port]),
		//		games = {};
		//	for(var i = 0; i < gameKeys.length; i++){
		//		var e = this.games[gameKeys[i]];
		//		gameStats.games[gameKeys[i]] = e.toJSON();
		//		//e.g2moku.getPlaying()
		//	}
		//};
		this.addGame = function(g2moku, callback){
			var game;
			if(g2moku.gameID) {
				game = new Game({
					g2moku: g2moku
				});
				console.log('!cantbe false');
				console.log(g2moku.gameID);
				//this.games[g2moku.gameID] = game;
				//console.log(this.games);
				if(!this.games[group]) this.games[group] = {};
				this.games[group][g2moku.gameID] = game; //FOR MULTIGROUP GROUP(MAYBE PORT) FUNCTIONALITY
				callback.apply(this.games[group][g2moku.gameID], [group]);
			}
		};
		this.getGame = function(gameID, callback){
			if(this.games[group][gameID]) {
				callback.apply(this.games[group][gameID], [group]);
			} else {
				callback(false);
			}
		};
		this.parseFromDatabase = function(){
			
		};
	};
	return games;
});