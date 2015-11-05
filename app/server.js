define([], function(){
	var server = function(s){
		var express = require('express.io');
		//var passport = require('passport');
		var path = require('path');
		var bodyParser = require('body-parser');
		var cookieParser = require('cookie-parser');
		var fs = require('fs');
		var morgan = require('morgan');
		//var session = require('express-session');
		var favicon = require('serve-favicon');
		//var mysql = require('mysql');
		//var flash = require('connect-flash');
		// global.pool = mysql.createPool({
			// connectionLimit : 10,
			// host     : 'localhost',
			// user     : 'root',
			// password : '',
			// database : ''
		// });

		var app = global.app = express();
		//console.log(logger);
		
		app.http().io();
		var port = global.port = process.env.PORT || 1337;

		// configure app
		app.set('view engine', 'ejs');
		app.set('views', path.join(__dirname, 'views'));
		app.set('PORT', port);

		app.use('/coverage', express.static(__dirname + '/../test/coverage/reports'));
		// use middleware
		app.use(cookieParser('secret')); 

		var dirs = __dirname.split('/'),
			onProduction = false;
		for(var i = 0; i < dirs.length; i++) {
			if(dirs[i].indexOf('axive') !== -1) onProduction = true;
		}
		app.use(morgan('common', {
			stream: fs.createWriteStream('./app/logs/access.log', {flags: 'a'})
		}));
		app.use(express.static(path.join(__dirname, !onProduction ? '/../_site' : '_site')));
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded());
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
		app.use(require('./routes'));
		//app.use(require('./auth'));

		//require('./mysql');

		var serv = app.listen(port, function(){
			console.log('Server running on port ' + serv.address().port + '...');
		});
	}(server || {});
	return server;
});