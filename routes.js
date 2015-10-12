var express = require('express');
var router = express.Router();

// define routes
router.get('/', function (req, res) {
	console.log(req.user);
	//if(req.user) console.log(req.user.get('id'));
	res.render('main', {
		me: req.user,
		title: 'Bot4vk - Homepage',
		template: 'index.ejs'
	});
});

// router.get('/bot/:bot', function (req, res) {
	// res.render('bot', {
		// 'bot': req.params.bot
	// });
// });

// app.get ('/docs', function (req, res) {

   // // Allow the docs.html template to 'include' markdown files
   // var marked = require ('marked');

   // var md = function (filename) {
      // var path = __dirname +"/views/docs/" + filename;
      // var include = fs.readFileSync (path, 'utf8');
      // var html = marked (include);

      // return html;
   // };

   // res.render ('docs', {"md": md});
// });


// In the template, do this:
// <%- md("index.md") %>




module.exports = router;