define(['Player', 'G2moku', 'utils'], function(Player, G2moku, utils){
	require('console.json');
	var color = require('cli-color');
	var routes = function(s){
		var r = this,
			app = s.app;
		r.counter = 0;
		s.beforeMoveToTile = function(req, callback){
			var address = req.socket.handshake.address,
				games = this.games;
			address = address.address + ':' + address.port;
			games.getGame(req.data.gameID, function(group) {
				//s.games.games[game.gameID] = game;
				var answer = {
						gameID: this.gameID,
						canMove: true,
						tile: req.data.tile
					},
					game = this;
				//global.log.log(game);
				this.playerMoving = true;
				this.g2moku.players.currentPlaying.moveToTile(answer.tile, req.data.layer, game.db_id, function(playerMove) {
					global.log.logAction([req.data.player.name, game.gameID, address, req.socket.id], 'Move to tile | ' + JSON.stringify(playerMove));
					playerMove.player = game.g2moku.players.currentPlaying;
					playerMove.id = game.g2moku.history.getNextID();
					//global.log.log(playerMove.id);
					//console.log(playerMove);
					game.g2moku.step(playerMove.tile.x, playerMove.tile.y, playerMove.player, function(win, turn) {
						global.log.logAction([req.data.player.name, game.gameID, address, req.socket.id], 'Checked for winner | win:' + win);
						//game.g2moku.history.push(playerMove);//
						game.g2moku.addHistory(playerMove);//
						global.log.log("PlayerMove: " + JSON.stringify(playerMove.toJSON()));
						global.log.log("history: " + JSON.stringify(game.g2moku.history.toJSON()));
						//console.log(callbackObj);
						if (win) {
							global.log.log("win!");
                            game.setStatus(2, "Game ended!");
                            game.playerMoving = false;
                            game.gameStarted = game.g2moku.gameStarted = true;
                            game.g2moku.players.willPlay(game.g2moku.players.currentPlaying);
                            game.gameStarted = game.g2moku.gameStarted = false;
                            games.sendGamesStats(req);


                            global.pool.getConnection(function(err, connection) {
                                if (err) {
                                    throw err;
                                }
                                connection.beginTransaction(function (err) {
                                    if (err) {
                                        throw err;
                                    }
                                    connection.query('UPDATE `game` SET gameEnd = ? WHERE Game_ID = ?', [new Date(), game.db_id], function(err, result) {
                                        if (err) {
                                            return connection.rollback(function () {
                                                throw err;
                                            });
                                        }
                                        connection.query('UPDATE `game` SET Winner_ID = ? WHERE Game_ID = ?', [playerMove.player.db_id, game.db_id], function(err, result) {
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
                                                setTimeout(function(){
                                                    games.clearGame(game.gameID);
                                                    games.sendGamesStats(req);
                                                }, 5000);
                                                console.log('success!');
                                            });
                                        });
                                    });
                                });
                            });
                            //callback.apply(game, [games]);
						} else {
							callback.apply(game, [games]);
						}
					});
					//Put tile on map
					//g.map.putTile(g.players.currentPlaying.playingTile, tileX, tileY);
				});
			});
		};
		// define routes
		app.get('/', function (req, res) {
			//if(req.user) console.log(req.user.get('id'));
			global.log.logRequest([req.ip], "Game page opened " + (++r.counter) + " time | " + JSON.stringify(req.route.path));
			global.log.logAction([req.ip], "Rendering page... | " + JSON.stringify(req.route.path) + " | game.ejs");
			res.render('game', {
                allgames: {
                    headers: [
                        "#", "Players", "GameMode", "Status", "Winner"
                    ]
                }
            });
		});
        app.get('/allGames', function(req, res) {
            //if(req.user) console.log(req.user.get('id'));
            global.log.logRequest([req.ip], "Ajax Request | " + JSON.stringify(req.route.path) + " | " + JSON.stringify(req.query));
            if(!req.query.type || req.query.type == "html") {
                global.pool.query(
                        'SELECT game2.PublicGame_ID, game2.Game_ID, game2.gameMode, game2.gameStart, game2.gameEnd, game2.Winner_ID, ( ' +
                        'SELECT playingName ' +
                        'FROM player ' +
                        'WHERE player.Player_ID = game2.Winner_ID ) AS Winner, ( ' +
                        'SELECT playingName ' +
                        'FROM player ' +
                        'WHERE player.Player_ID = game2.Player_ID ' +
                        ') AS beginPlayer, ( ' +
                        'SELECT GROUP_CONCAT(player.playingName) ' +
                        'FROM player_opponent_games ' +
                        'INNER JOIN game ' +
                        'ON game.Game_ID = player_opponent_games.Game_ID ' +
                        'INNER JOIN player ' +
                        'ON player.Player_ID = player_opponent_games.Player2_ID ' +
                        'WHERE game.Game_ID = game2.Game_ID ' +
                        'GROUP BY game.Game_ID ' +
                        ') AS Players ' +
                        'FROM `game` AS game2 ' +
                        'ORDER BY gameStart DESC',
                    function(err, results, fields) {
                    if(err) console.log(err);
                    else {
                        console.log(JSON.stringify(results));
                        global.log.logAction([req.ip], "Rendering page... | " + JSON.stringify(req.route.path) + " | all_games.ejs");
                        res.render('all_games', {
                            printStatus: function(game){
                                var status = "<td class='bg-warning'>Game Inited";
                                if(game.gameStart && game.gameEnd && game.Winner_ID) status = "<td class='bg-danger'>Game Ended";
                                else if(game.gameStart && game.gameEnd) status = "<td class='bg-danger'>Game Ended";
                                else if(game.gameStart) status = "<td class='bg-success'>Game Started";
                                return status + '</td>';
                            },
                            printGameID: utils.getFormatedGameID,
                            allgames: {
                                headers: [
                                    "#", "Players", "GameMode", "Status", "Winner"
                                ],
                                content: results
                            }
                        });
                    }
                });
            }
        });
		app.get('/rules', function (req, res) {
			res.render('game_rules', {

            });
		});
        if(s.io.on) {
            s.io.on('connection', function (socket) {
                socket.on('request.tiles.available', function (data) {
                    var answer = {
                        'green': {
                            imgPath: '/assets/img/tiles/square1.png',
                            index: 61
                        },
                        'yellow': {
                            imgPath: '/assets/img/tiles/square2.png',
                            index: 95
                        },
                        'rose': {
                            imgPath: '/assets/img/tiles/square3.png',
                            index: 105
                        },
                        'blue': {
                            imgPath: '/assets/img/tiles/square5.png',
                            index: 38
                        }
                    };
                    var address = socket.handshake.address;
                    address = address.address + ':' + address.port;
                    global.log.logRequest([address, socket.id], "response.tiles.available | " + JSON.stringify(data));

                    global.log.logResponse([address, socket.id], "response.tiles.available", JSON.stringify(answer));
                    s.io.emit('response.tiles.available', answer);
                });
                socket.on('ready', function (data) {
                    var answer = {
                        message: 'Realtime'
                    };
                    var address = socket.handshake.address;
                    address = address.address + ':' + address.port;
                    global.log.logRequest([address, socket.id], "ready(DOM Loaded) | " + JSON.stringify(data));

                    global.log.logResponse([address, socket.id], "welcome", JSON.stringify(answer));
                    //send some information on DOM loaded
                    s.io.emit('welcome', answer);
                });
                socket.on('disconnect', function () {
                    s.io.emit('user disconnected');
                });

                /**
                 * Before real game experience.
                 */
                socket.on('request.game.play', function (req) {
                    var address = req.socket.handshake.address;
                    address = address.address + ':' + address.port;
                    global.log.logRequest([address, req.socket.id], "playGame | " + JSON.stringify(req.data));
                    var g = new G2moku(),
                        answer = {
                            can: true// canPlayGame
                        };
                    global.log.logAction([address, req.socket.id], "G2moku object created");
                    if (req.data.gameMode) g.gameMode = req.data.gameMode;
                    g.players.createPlayers(req.data.players, function (players) {
                        global.log.logAction([address, req.socket.id], "Players created");
                        global.log.log(g.players.playing);
                        g.generateID(function (preGenerated, genID) {
                            if (preGenerated !== false) {
                                var genetated = "",
                                    newGenerated = "";
                                //global.games[newGenerated] = g;
                                //newGenerated = preGenerated + "." + genID;
                                answer.gameID = g.gameID = preGenerated;
                                answer.genID = g.genID = genID;
                                s.games.addGame(g, function (group) { //!!transaction in game adding
                                    if (this.gameID) this.setStatus(0, "Waiting to begin");
                                    s.games.sendGamesStats(req);
                                    answer.game = this.toJSON();
                                    global.log.logResponse([g.gameID, address, req.socket.id], "playGame | " + JSON.stringify(answer));
                                    //s.games.games[game.gameID] = game;
                                    req.io.emit('playGame', answer);
                                });
                            }
                        });
                    });

                    //global.game = new G2moku();
                });

                socket.on('request.game.start', function (data) {
                    var address = socket.handshake.address;
                    address = address.address + ':' + address.port;
                    global.log.logRequest([data.gameID, address, socket.id], "startGame | " + JSON.stringify(data));
                    var answer = {
                        can: true// canPlayGame
                    };
                    s.games.getGame(data.gameID, function (group) {
                        var game = this;
                        global.pool.query('UPDATE `game` SET gameStart = ? WHERE Game_ID = ?', [new Date(), game.db_id], function (err, result) {
                            if (err) throw err;
                            game.gameStarted = game.g2moku.gameStarted = true;
                            if (game.gameID) game.setStatus(1, "Game started");
                            s.games.sendGamesStats(req);
                            //global.log.log(game.g2moku.players.currentPlaying.getJSON());
                            game.g2moku.players.next(game.gameStarted);
                            game.g2moku.players.currentPlaying.startTimer();
                            //global.log.log(game.g2moku.players.currentPlaying.getJSON());
                            answer.gameID = game.gameID;
                            global.log.logAction([game.gameID, address, req.socket.id], "Starting game...");
                            //game.
                            global.log.logResponse([game.gameID, address, req.socket.id], "startGame | " + JSON.stringify(answer));
                            req.io.emit('startGame', answer);//
                        });
                    });
                });
            });
            s.io.on('join', function (req) {
                var address = req.socket.handshake.address;
                address = address.address + ':' + address.port;
                global.log.logRequest([address, req.socket.id], "join | " + JSON.stringify(req.data));
                if (req.data.name) {
                    var answer = {},
                        player = new Player(req.data.name);
                    answer.player = player.getJSON();
                    app.io.broadcast('joined', answer);
                }
            });
            s.io.on('addGameRoom', function (req) {
                var address = req.socket.handshake.address;
                address = address.address + ':' + address.port;
                global.log.logRequest([address, req.socket.id], "addGameRoom | " + JSON.stringify(req.data));
                if (req.data.name) {
                    var answer = {},
                        player = new Player(req.data.name);
                    answer.player = player.getJSON();
                    app.io.broadcast('joined', answer);
                }
            });
            s.io.on('moveToTile', function (req) {
                var address = req.socket.handshake.address;
                address = address.address + ':' + address.port;
                global.log.logRequest([req.data.player.name, req.data.gameID, address, req.socket.id], "moveToTile | " + JSON.stringify(req.data));
                s.beforeMoveToTile(req, function (games) {
                    //global.log.log('players: ' + game.g2moku.players.playing.length);
                    this.g2moku.players.willPlay(this.g2moku.players.currentPlaying);
                    //global.log.log('players: ' + JSON.stringify(game.g2moku.players.getPlaying()));
                    //if(game.gameID && s.games.games[game.gameID]) game.setStatus(1, "Moving: " + s.games.games[game.gameID].g2moku.players.currentPlaying.name);
                    games.sendGamesStats(req);
                    //global.log.log('gameStarted:' + game.gameStarted);
                    this.g2moku.players.next(this.gameStarted);//take next player in queue
                    //global.log.log('players: ' + game.g2moku.players.playing.length);
                    //game.g2moku.$gameTopBar.find('.game-play-text').html("<span class='game-next-player'>" + g.players.currentPlaying.name + "</span>'s turn!");
                    //game.g2moku.players.currentPlaying.$box.addClass('active');
                    this.g2moku.players.currentPlaying.startTimer();

                    this.playerMoving = false;
                    console.log(s.games.group);
                    console.log(req.data.gameID);
                    //s.games[s.games.group][req.data.gameID] = this;
                });
            });
            s.io.on('beforeMoveToTile', function (req) {
                var answer = {
                    gameID: game.gameID,
                    canMove: true,
                    tile: req.data.tile
                };
                var address = req.socket.handshake.address;
                address = address.address + ':' + address.port;
                global.log.logRequest([req.data.player.name, req.data.gameID, address, req.socket.id], "beforeMoveToTile | " + JSON.stringify(req.data));
                //console.log(color.black.bgWhite.underline("[ " + req.socket.id + " ]") + "" + color.black.bgYellow.underline(" REQUEST: beforeMoveToTile"));
                //console.log(color.white.bgGreen.underline(" Tile: " + JSON.stringify(req.data.tile)) + color.white.bgCyan.underline(" Player: " + JSON.stringify(req.data.player.name))+ color.white.bgMagenta.underline(" Time: " + JSON.stringify(req.data.player.timer)));
                //checking for move
                //global.log.log(game.g2moku.players.currentPlaying);
                //beforeMoveToTile(req, function(game){
                global.log.logResponse([req.data.player.name, game.gameID, address, req.socket.id], "beforeMoveToTile | " + JSON.stringify(answer));
                req.io.emit('beforeMoveToTile', answer);
                //});
            });
        }
	};
	return routes; 
});
