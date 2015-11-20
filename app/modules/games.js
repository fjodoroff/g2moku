define(['Game'], function(Game) {
	var games = function(port) {
		this.games = {};
		this.port = port;
		this.addGame = function(g2moku, callback){
			var game;
			if(g2moku.gameID) {
				game = new Game({
					g2moku: g2moku
				});
				this.games[g2moku.gameID] = game;
				//global.games[port][g2moku.gameID] = game; //FOR MULTI PORT FUNCRIONALITY global
				callback(game);
			}
		};
		this.getGame = function(gameID, callback){
			if(this.games[gameID]) {
				callback(this.games[gameID]);
			} else {
				callback(false);
			}
		};
		this.parseFromDatabase = function(){
			
		};
	};
	return games;
});