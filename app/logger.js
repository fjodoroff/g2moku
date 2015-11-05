define([], function() {
    var winston = require('winston');
	winston.emitErrs = false;
	var logger = function(log){
		log = new winston.Logger({
			transports: [
				// new winston.transports.File({
					// level: 'info',
					// filename: './logs/access.log',
					// handleExceptions: true,
					// json: true,
					// //maxsize: 5242880, //5MB
					// //maxFiles: 5,
					// colorize: false
				// }),
				new winston.transports.Console({
					level: 'log',
					handleExceptions: false,
					json: true,
					colorize: true
				})
			],
			exitOnError: false
		});
		log.stream = function(message, encoding){
			//log.logger.info(message);
		};
		return log;
	}(logger || {});
    //The value returned from the function is
    //used as the module export visible to Node.
    return logger;
});


// define([], function(){
	// var winston = require('winston');
	// winston.emitErrs = true;
	// var logger = new winston.Logger({
		// transports: [
			// new winston.transports.File({
				// level: 'info',
				// filename: './logs/all-logs.log',
				// handleExceptions: true,
				// json: true,
				// maxsize: 5242880, //5MB
				// maxFiles: 5,
				// colorize: false
			// }),
			// new winston.transports.Console({
				// level: 'debug',
				// handleExceptions: true,
				// json: false,
				// colorize: true
			// })
		// ],
		// exitOnError: false
	// });
	// var stream = {
		// write: function(message, encoding){
			// logger.info(message);
		// }
	// };
	//var log = function(l){
	// var l = new winston.Logger({
			// transports: [
				// new winston.transports.File({
					// level: 'info',
					// filename: './logs/all-logs.log',
					// handleExceptions: true,
					// json: true,
					// maxsize: 5242880, //5MB
					// maxFiles: 5,
					// colorize: false
				// }),
				// new winston.transports.Console({
					// level: 'debug',
					// handleExceptions: true,
					// json: false,
					// colorize: true
				// })
			// ],
			// exitOnError: false
		// });
		// l.stream = {
			// write: function(message, encoding){
				// l.info(message);
			// }
		// };
		//return l;
	//}(log || {});
	//return log;
	//return logger;
//});