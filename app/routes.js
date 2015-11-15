define(['Player', 'G2moku'], function(Player, G2moku){
	var routes = function(app){
		var r = this;
		require('console.json');
		var color = require('cli-color');
		r.counter = 0;

		// define routes
		app.get('/', function (req, res) {
			//if(req.user) console.log(req.user.get('id'));
			console.log(color.yellow("REQUEST: ") + "Game page opened " + (++r.counter) + " time");
			//console.log(req);
			//req.io.broadcast('log', req);	
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
		app.io.route('request.tiles.available', function(req) {
			var serverResponse = {
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
			console.log(color.black.bgWhite.underline("[ " + req.socket.id + " ]") + " Getting availableTiles");
			global.log.file.info("[ " + req.socket.id + " ]" + " Getting availableTiles");
			req.io.emit('response.tiles.available', serverResponse);
		});
		app.io.route('beforeMoveToTile', function(req) {
			console.log(color.black.bgWhite.underline("[ " + req.socket.id + " ]") + "" + color.black.bgYellow.underline(" RESPONSE: beforeMoveToTile"));
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
			console.log('Start Game');
			if(!global.games) global.games = {};
			global.games[1] = new G2moku();
		});
		app.io.route('playGame', function(req) {
			if(req.data instanceof Array) {
				for(var i = 0; i < req.data.length; i++) {
					var e = req.data[i];
					var player = new Player({
						name: e.name,
						layer: e.layer,
						tile: null
					});
					console.log(player);
				}
			}
			//global.game = new G2moku();
		});
		app.io.route('ready', function(req) {
			//console.log(req.socket.id);
			console.log(color.black.bgWhite.underline("[ " + req.socket.id + " ]") + " " + color.green("RESPONSE: ++Online | ") + "ScreenSize: " + req.data.screenSize.x + "x" + req.data.screenSize.y);
			//console.log(req);
			req.io.emit('welcome', {
				message: 'Realtime'
			});
		});
	}
	return routes; 
});