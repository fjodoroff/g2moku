define([], function(){
	var routes = function(app){
		var r = this;
		require('console.json');
		r.clc = require('cli-color');
		r.counter = 0;

		// define routes
		app.get('/', function (req, res) {
			//if(req.user) console.log(req.user.get('id'));
			console.log(r.clc.yellow("REQUEST: ") + "Game page opened " + (++r.counter) + " time");
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
			console.log(r.clc.black.bgWhite.underline("[ " + req.socket.id + " ]" + " Getting availableTiles"));
			req.io.emit('response.tiles.available', serverResponse);
		});
		app.io.route('ready', function(req) {
			console.log(req.socket.id);
			console.log(r.clc.black.bgWhite.underline("[ " + req.socket.id + " ]") + " " +r.clc.green("RESPONSE: ++Online | ") + "ScreenSize: " + req.data.screenSize.x + "x" + req.data.screenSize.y);
			req.io.broadcast('online');
			//console.log(req);
			req.io.emit('welcome', {
				message: 'Realtime'
			});
		});
	}
	return routes;
});