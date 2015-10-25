var express = require('express');
var router = express.Router();
var clc = require('cli-color');
var counter = 0;

// define routes
router.get('/', function (req, res) {
	//if(req.user) console.log(req.user.get('id'));
	console.log(clc.green("Game page opened " + (++counter) + " time"));
	res.render('game', {});
});

// router.get('/bot/:bot', function (req, res) {
	// res.render('bot', {
		// 'bot': req.params.bot
	// });
// });

app.get ('/rules', function (req, res) {
	console.log(clc.green("Parsing rules..."));
	res.render('game_rules', {});
}); 


// In the template, do this:
// <%- md("index.md") %>




module.exports = router;