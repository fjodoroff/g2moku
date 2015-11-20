define(['routes', 'games', 'utils'], function(routes, games, utils){
	var Server = function(port){
		var s = this;
		var bunyan = require('bunyan');
		s.express = require('express.io');		
		//var passport = require('passport');
		//var session = require('express-session');
		s.path = require('path');
		var color = require('cli-color');
		s.bodyParser = require('body-parser');
		s.cookieParser = require('cookie-parser');
		s.fs = require('fs');
		s.favicon = require('serve-favicon');
		s.games = new games(port);
		//logger start
		s.log = {
			console: bunyan.createLogger({
				name: 'log',
				streams: [{
					level: 'info',
					name: 'info-console',
					stream: process.stdout
				}]
			}),
			file: bunyan.createLogger({
				name: 'log',
				streams: [{
					level: 'error',
					path: s.path.join(__dirname, '/../logs/error.log')
				},{
					level: 'info',
					path: s.path.join(__dirname, '/../logs/info.log')
				}]
			})
		};
		s.log.log = function(object) {
			global.log.file.info(object, "Logging...");
			console.log(color.black.bgCyan.underline(utils.isObject(object) ? JSON.stringify(object) : object));
			//s.log.file.debug(object);
		};
		s.log.logRequest = function(requestData, method, msg) {
			var message = color.black.bgWhite.underline(JSON.stringify(requestData)) + "" + color.black.bgYellow.underline(" REQUEST: " + method) + (msg ? "|" + msg : "");
			global.log.file.info(requestData, message);
			console.log(message);
		};
		s.log.logAction = function(requestData, method, msg) {
			var message = color.black.bgWhite.underline(JSON.stringify(requestData)) + "" + color.black.bgMagenta.underline(" ACTION: " + method) + (msg ? "|" + msg : "");
			global.log.file.info(requestData, message);
			console.log(message);
		};	
		s.log.logResponse = function(requestData, method, msg) {
			var message = color.black.bgWhite.underline(JSON.stringify(requestData)) + "" + color.black.bgGreen.underline(" RESPONSE: " + method) + (msg ? "|" + msg : "");
			global.log.file.info(requestData, message);
			console.log(message);
		};
		global.log = s.log;
		//logger end
		
		
		
		//var mysql = require('mysql');
		//var flash = require('connect-flash');
		// global.pool = mysql.createPool({
			// connectionLimit : 10,
			// host     : 'localhost',
			// user     : 'root',
			// password : '',
			// database : ''
		// });
		var dirs = __dirname.split(__dirname.indexOf('/') != -1 ? '/' : '\\'),
			onProduction = false;
		var tempDirs = dirs;
		tempDirs.pop();
		global.APP_PATH = tempDirs.join(__dirname.indexOf('/') != -1 ? '/' : '\\');
		console.log(dirs);
		console.log(global.APP_PATH);
		for(var i = 0; i < dirs.length; i++) {
			if(dirs[i].indexOf('axive') !== -1) onProduction = true;
		}
		
		s.app = app = s.express();
		s.port = port;
		app.http().io();

		// configure app
		app.set('view engine', 'ejs');
		app.set('views', s.path.join(__dirname, '/../views'));
		app.set('PORT', port);

		//app.use('/coverage', s.express.static(__dirname + '/../test/coverage/reports'));
		// use middleware
		app.use(s.cookieParser('secret')); 

		app.use(require('express-bunyan-logger')({
			streams: [{
				level: 'info',
				path: s.path.join(global.APP_PATH, '/logs/access.log')
			}]
		}));
		app.use(s.express.static(s.path.join(global.APP_PATH, !onProduction ? '/../_site' : '_site')));
		app.use(s.bodyParser.json());
		app.use(s.bodyParser.urlencoded());
		//app.use(favicon(path.join(__dirname, '../_site/favicon.ico')));
		//app.use(flash());
		// app.use(session({
			// secret: 'keyboard cat',
			// resave: true,
			// saveUninitialized: true,
			// maxAge: 60000
		// }));
		//app.use(passport.initialize());
		//app.use(passport.session());
		s.routes = new routes(s);
		app.use(s.routes);
		//app.use(require('./auth'));

		//require('./mysql');

		s.serv = app.listen(port, function(){
			s.log.console.info("New server started at port " + port);
			s.log.file.info("New server started at port " + port);
			console.log('Server running on port ' + s.serv.address().port + '...');
		});
	}
	return Server;
});