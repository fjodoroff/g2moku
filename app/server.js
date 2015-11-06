define(['routes'], function(routes){
	var Server = function(port){
		var s = this;
		s.express = require('express.io');
		//var passport = require('passport');
		s.path = require('path');
		s.bodyParser = require('body-parser');
		s.cookieParser = require('cookie-parser');
		s.fs = require('fs');
		s.morgan = require('morgan');
		//var session = require('express-session');
		s.favicon = require('serve-favicon');
		//var mysql = require('mysql');
		//var flash = require('connect-flash');
		// global.pool = mysql.createPool({
			// connectionLimit : 10,
			// host     : 'localhost',
			// user     : 'root',
			// password : '',
			// database : ''
		// });
		s.app = app = s.express();
		s.port = port;
		//console.log(logger);
		
		app.http().io();

		// configure app
		app.set('view engine', 'ejs');
		app.set('views', s.path.join(__dirname, 'views'));
		app.set('PORT', port);

		app.use('/coverage', s.express.static(__dirname + '/../test/coverage/reports'));
		// use middleware
		app.use(s.cookieParser('secret')); 

		var dirs = __dirname.split('/'),
			onProduction = false;
		for(var i = 0; i < dirs.length; i++) {
			if(dirs[i].indexOf('axive') !== -1) onProduction = true;
		}
		app.use(s.morgan('common', {
			stream: s.fs.createWriteStream('./app/logs/access.log', {flags: 'a'})
		}));
		app.use(s.express.static(s.path.join(__dirname, !onProduction ? '/../_site' : '_site')));
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
		s.routes = new routes(app);
		app.use(s.routes);
		//app.use(require('./auth'));

		//require('./mysql');

		s.serv = app.listen(port, function(){
			console.log('Server running on port ' + s.serv.address().port + '...');
		});
	}
	return Server;
});