var express = require('express');
//var passport = require('passport');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
//var session = require('express-session');
//var morgan = require('morgan');
var favicon = require('serve-favicon');
//var mysql = require('mysql');
//var flash = require('connect-flash');
// global.pool = mysql.createPool({
	// connectionLimit : 10,
	// host     : 'localhost',
	// user     : 'root',
	// password : '',
	// database : 'bot4vk'
// });

var app = express();
var port = global.port = process.env.PORT || 1337;

// configure app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('PORT', port);

// use middleware
//app.use(morgan('dev'))
app.use(cookieParser('secret')); 
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(favicon(path.join(__dirname, '_site/favicon.ico')));
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

app.listen(port, function(){
	console.log('Server running on port ' + port + '...');
});