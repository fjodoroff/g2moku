// var mysql = require('mysql');
// var schemas = require("../schemas.js");
// var _ = require("lodash");

// var User = function(data) {
    // this.data = this.sanitize(data);
// }

// User.prototype.data = {}

// User.prototype.changeName = function (name) {
    // this.data.name = name;
// }

// User.prototype.get = function (name) {
    // return this.data[name] ? this.data[name] : "";
// }

// User.prototype.set = function (name, value) {
    // this.data[name] = value;
// }

// User.prototype.sanitize = function (data) {
    // data = data || {};
    // schema = schemas.user;
    // return _.pick(_.defaults(data, schema), _.keys(schema)); 
// }

// User.prototype.save = function(callback) {
    // var self = this;
    // this.data = this.sanitize(this.data);
    // db.get('users', {id: this.data.id}).update(JSON.stringify(this.data)).run(function (err, result) {
        // if (err) return callback(err);
        // callback(null, result); 
    // });
// }
// User.findByVkontakteID = function(id, callback) {
	// global.pool.getConnection(function(err, connection) {
		// if(err) return callback(err, false);
		// // Use the connection
		// connection.query("SELECT * FROM `Users` WHERE `VkontakteID` = ?", [id.toString()], function(err, rows) {
			// // And done with the connection.
			// connection.release();
			// if(err) return callback(err, false);
			// if(rows.length > 0) {
				// //console.log(color.green(profile.id + '. User found, authorizing...'));
				// var user = {
					// id: rows[0].ID,
					// username: null,
					// avatar_50: rows[0].Avatar,
					// displayName: [rows[0].FirstName, " ", rows[0].LastName].join(),
					// profileUrl: null
				// };
				// callback(null, user);
			// } else {
				// //console.log(color.red(profile.id + '. VkontakteID not found!'));
				// callback(null, false);
			// }
			// //console.log('SELECT FROM USERS');
			// //console.log(rows);

			// // Don't use the connection here, it has been returned to the pool.
		// });
	// });
// }
// User.findByID = function(id, callback) {
	// global.pool.getConnection(function(err, connection) {
		// if(err) return callback(err, false);
		// // Use the connection
		// connection.query("SELECT * FROM `Users` WHERE `ID` = ?", [id.toString()], function(err, rows) {
			// // And done with the connection.
			// connection.release();
			// if(err) return callback(err, false);
			// if(rows.length > 0) {
				// //console.log(color.green(profile.id + '. User found, authorizing...'));
				// var user = {
					// id: rows[0].ID,
					// username: null,
					// full_name: rows[0].FirstName + " " + rows[0].LastName,
					// avatar_50: rows[0].Avatar,
					// displayName: [rows[0].FirstName, " ", rows[0].LastName].join(),
					// profileUrl: null
				// };
				// callback(null, user);
			// } else {
				// //console.log(color.red(profile.id + '. VkontakteID not found!'));
				// callback(null, false);
			// }
			// //console.log('SELECT FROM USERS');
			// //console.log(rows);

			// // Don't use the connection here, it has been returned to the pool.
		// });
	// });
// }

// module.exports = User;