define(['Player', 'G2moku'], function(Player, G2moku){
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
				this.g2moku.players.currentPlaying.moveToTile(answer.tile, req.data.layer, function(playerMove) {
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
			res.render('game', {});
		});

		app.get('/rules', function (req, res) {
			res.render('game_rules', {});
		});
		app.io.route('getAvailableTiles', function(req) {
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
			var address = req.socket.handshake.address;
			address = address.address + ':' + address.port;
			global.log.logRequest([address, req.socket.id], "getAvailableTiles | " + JSON.stringify(req.data));
			
			global.log.logResponse([address, req.socket.id], "getAvailableTiles", JSON.stringify(answer));
			req.io.emit('getAvailableTiles', answer);
		});
		app.io.route('moveToTile', function(req) {
			var address = req.socket.handshake.address;
			address = address.address + ':' + address.port;
			global.log.logRequest([req.data.player.name, req.data.gameID, address, req.socket.id], "moveToTile | " + JSON.stringify(req.data));
			s.beforeMoveToTile(req, function(games){
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
				s.games[req.data.gameID] = this;
			});
	});
		app.io.route('beforeMoveToTile', function(req) {
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
			setTimeout(function(){
				//global.log.log(game.g2moku.players.currentPlaying);
				//beforeMoveToTile(req, function(game){
				global.log.logResponse([req.data.player.name, game.gameID, address, req.socket.id], "beforeMoveToTile | " + JSON.stringify(answer));
				req.io.emit('beforeMoveToTile', answer);
				//});
			}, 1000);
		});
		app.io.route('startGame', function(req) {
			var address = req.socket.handshake.address;
			address = address.address + ':' + address.port;
			global.log.logRequest([req.data.gameID, address, req.socket.id], "startGame | " + JSON.stringify(req.data));
			var answer = {
				can: true// canPlayGame
			};
			setTimeout(function(){
				s.games.getGame(req.data.gameID, function(group){
					this.gameStarted = this.g2moku.gameStarted = true;
					if(this.gameID) this.setStatus(1, "Game started");
					s.games.sendGamesStats(req);
					//global.log.log(game.g2moku.players.currentPlaying.getJSON());
					this.g2moku.players.next(this.gameStarted);
					this.g2moku.players.currentPlaying.startTimer();
					//global.log.log(game.g2moku.players.currentPlaying.getJSON());
					answer.gameID = this.gameID;
					global.log.logAction([this.gameID, address, req.socket.id], "Starting game...");
					//game.
					global.log.logResponse([this.gameID, address, req.socket.id], "startGame | " + JSON.stringify(answer));
					req.io.emit('startGame', answer);//
				});
			}, 1000);
		});
		app.io.route('playGame', function(req) {
			var address = req.socket.handshake.address;
			address = address.address + ':' + address.port;
			global.log.logRequest([address, req.socket.id], "playGame | " + JSON.stringify(req.data));
			var g = new G2moku(),
				answer = {
					can: true// canPlayGame
				};
			if(req.data.gameMode) g.gameMode = req.data.gameMode;
			g.players.createPlayers(req.data.players);
			global.log.log(g.players.playing);
			setTimeout(function(){
				global.log.logAction([address, req.socket.id], "Creating g2moku object, generating gameID...");
				g.generateID(function(preGenerated, genID){
					if(preGenerated !== false) {
						var genetated = "",
							newGenerated = "";
						//global.games[newGenerated] = g;
						//newGenerated = preGenerated + "." + genID;
						answer.gameID = g.gameID = preGenerated;
						answer.genID = g.genID = genID;
						s.games.addGame(g, function(group) {
							if(this.gameID) this.setStatus(0, "Waiting to begin");
							s.games.sendGamesStats(req);
							answer.game = this.toJSON();
							global.log.logResponse([g.gameID, address, req.socket.id], "playGame | " + JSON.stringify(answer));
							//s.games.games[game.gameID] = game;
							req.io.emit('playGame', answer);
						});
					}
				});
			}, 1000);
			//global.game = new G2moku();
		});
		app.io.route('ready', function(req) {
			var answer = {
				message: 'Realtime'
			};
			var address = req.socket.handshake.address;
			address = address.address + ':' + address.port;
			global.log.logRequest([address, req.socket.id], "ready(DOM Loaded) | " + JSON.stringify(req.data));

			global.log.logResponse([address, req.socket.id], "welcome", JSON.stringify(answer));
			//send some information on DOM loaded
			req.io.emit('welcome', answer);
		});
	}
	return routes; 
});
