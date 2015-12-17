define(['Game', 'Player'], function(Game, Player) {
	var games = function(group) {
		this.games = {};
        this.onlineGames = {};
		this.group = group;
		this.sendGamesStats = function(req){
			var gameStats = {
					games: {}
				},
				gameKeys = Object.keys(this.games[group]);
			for(var i = 0; i < gameKeys.length; i++){
				var e = this.games[group][gameKeys[i]];
				if(typeof e !== 'string') gameStats.games[gameKeys[i]] = e.getStats();
				//e.g2moku.getPlaying()
			}
			global.log.logResponse(["Broadcast", "Everyone"], "sendGameStats | " + JSON.stringify(gameStats));
			req.io.broadcast('sendGamesStats', gameStats);
		};
        this.join = function(req, callback) {

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
				//console.log('!cantbe false');
				console.log(g2moku.gameID);

                global.pool.getConnection(function(err, connection) {
                    if (err) {
                        throw err;
                    }
                    connection.beginTransaction(function (err) {
                        if (err) {
                            throw err;
                        }
                        connection.query('INSERT INTO `game` (Player_ID, PublicGame_ID, gameMode) VALUES (?, ?, ?)', [g2moku.players.arr[0].db_id, g2moku.gameID, g2moku.gameMode], function (err, result) {
                            if (err) {
                                return connection.rollback(function () {
                                    throw err;
                                });
                            }
                            //var log = 'Game ' + result.insertId + ' added';
                            game.db_id = result.insertId;
                            //console.log(g2moku.players);
                            var queryString = "";
                            for (var i = 1; i < g2moku.players.arr.length; i++) {
                                queryString += "INSERT INTO `player_opponent_games` (Player_ID, Player2_ID, Game_ID) VALUES (" +
                                    connection.escape(g2moku.players.arr[0].db_id) + ", " + connection.escape(g2moku.players.arr[i].db_id) +
                                    ", " + connection.escape(result.insertId) + ");";
                            }
                            connection.query(queryString, function (err, result) {
                                if (err) {
                                    return connection.rollback(function () {
                                        throw err;
                                    });
                                }
                                connection.commit(function (err) {
                                    if (err) {
                                        return connection.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    console.log('success!');
                                });
                            });
                        });
                    });
                });
				if(!this.games[group]) this.games[group] = {};
				this.games[group][g2moku.gameID] = game; //FOR MULTIGROUP GROUP(MAYBE PORT) FUNCTIONALITY
				callback.apply(this.games[group][g2moku.gameID], [group]);
			}
		};
        this.clearGame = function(gameID){//clear from memory
            if(this.games[group][gameID]) {
                this.games[group][gameID] = 'cleared';
            }
        };
		this.getGame = function(gameID, callback){
			if(this.games[group][gameID] && typeof this.games[group][gameID] !== 'string') {
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