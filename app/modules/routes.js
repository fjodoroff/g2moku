define(['Player', 'G2moku'], function(Player, G2moku){
	require('console.json');
	var color = require('cli-color');
	var routes = function(app){
		var r = this;
		r.counter = 0;

		// define routes
		app.get('/', function (req, res) {
			//if(req.user) console.log(req.user.get('id'));
			global.log.logRequest([req.ip], "Game page opened " + (++r.counter) + " time | " + JSON.stringify(req.route.path));
			global.log.logAction([req.ip], "Rendering page... | " + JSON.stringify(req.route.path) + " | game.ejs");
			res.render('game', {});
		});

		// router.get('/bot/:bot', function (req, res) {
			// res.render('bot', {
				// 'bot': req.params.bot
			// });
		// });

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
		app.io.route('beforeMoveToTile', function(req) {
			console.log(color.black.bgWhite.underline("[ " + req.socket.id + " ]") + "" + color.black.bgYellow.underline(" REQUEST: beforeMoveToTile"));
			console.log(color.white.bgGreen.underline(" Tile: " + JSON.stringify(req.data.tile)) + color.white.bgCyan.underline(" Player: " + JSON.stringify(req.data.player.name))+ color.white.bgMagenta.underline(" Time: " + JSON.stringify(req.data.player.timer)));
			//checking for move
			setTimeout(function(){
				req.io.emit('beforeMoveToTile', {
					canMove: true,
					tile: [req.data.tile.x, req.data.tile.y]
				});						
			}, 1000); 
		});		
		app.io.route('startGame', function(req) {

		});
		app.io.route('playGame', function(req) {
			var address = req.socket.handshake.address;
			address = address.address + ':' + address.port;
			global.log.logRequest([address, req.socket.id], "playGame | " + JSON.stringify(req.data));
			var g = new G2moku(),
				answer = {
					can: true,// canPlayGame
				};
			g.players.createPlayers(req.data.players);
			setTimeout(function(){
				console.log(g.players);
				g.generateID(function(preGenerated, genID){
					var genetated = "",
						newGenerated = "";
					//global.games[newGenerated] = g;
					console.log('Play Game');
					answer.gameID = preGenerated + "." + genID;
					global.games.addGame(g);
					req.io.emit('playGame', answer);				
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
