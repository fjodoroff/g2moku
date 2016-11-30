var request = require('supertest');
var express = require('express');
var nock = require('nock');

require = require('amdrequire');
require(['../../../app/config.js'], function(config){
	// Set basepaths first
	config.basePath = __dirname;
	// config.publicPath = __dirname + '/public';
	require.config(config);
});
require(['Server'], function(Server){
	var server = new Server(2000);
	describe('Game routes', function () {


		// it('should respond with a 200 with no query parameters', function (done) {

		// request(app)
		// .get('/')
		// .expect('Content-Type', /html/)
		// .expect(200, done);

		// });


		// it('should respond with a 200 with valid query parameters', function (done) {

		// // mock the flickr public feed api endpoint
		// var jsonpData = 'jsonFlickrFeed({"items": [' +
		// '{ "title": "Boating",' +
		// '"media": {"m":"http://farm4.staticflickr.com/3727/12608622365_9e9b8b377d_m.jpg"} },' +
		// '{ "title": "Signs",' +
		// '"media": {"m":"http://farm8.staticflickr.com/7446/12608714423_efaf73400c_m.jpg"} }' +
		// ']})';

		// var flickrFeedApi = nock('http://api.flickr.com')
		// .get('/services/feeds/photos_public.gne?tags=california&tagmode=all&format=json')
		// .reply(200, jsonpData);

		// request(app)
		// .get('/?tags=california&tagmode=all')
		// .expect('Content-Type', /html/)
		// .expect(200)
		// .expect(/<div class="panel panel-default search-results">/, done);

		// });


		// it('should respond with a 200 with invalid query parameters', function (done) {

		// request(app)
		// .get('/?tags=california123&tagmode=all')
		// .expect('Content-Type', /html/)
		// .expect(200)
		// .expect(/<div class="alert alert-danger">/, done);

		// });


		it('Main page should respond with a 200 answer and html as a content-type', function (done) {
			console.log(server.app);
			request(server.app)
				.get('/')
				.expect('Content-Type', /html/)
				.expect(200, done);
		});

	});
});
