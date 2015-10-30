module.exports = function (config) {
    'use strict';
    config.set({

        basePath: './',

        frameworks: ['mocha', 'requirejs', 'chai'],
		
		// list of files / patterns to load in the browser
        // files: [
            // {pattern: 'node_modules/**/*.js', included: false},   // allow to load any *.js from node_modules by karma web-server
            // {pattern: '_site/assets/js/libs/prototype/prototype.js', include: true},
            // '_site/assets/js/modules/player.js',
            // 'test/frontend/*.js'
        // ],
		
		files: [
			{pattern: 'node_modules/**/*.js', included: false},   // allow to load any *.js from node_modules by karma web-server
			{pattern: '_site/assets/js/**/*.js', included: false},
			//{pattern: '_site/assets/js/player.js', included: false},
			{pattern: 'test/frontend/**/*Spec.js', included: false},
			'test/test-main.js'
		],


		// list of files to exclude
        exclude: [
            'karma.conf.js',
			'node_modules/grunt**/*.js'
        ],


		// use dots reporter, as travis terminal does not support escaping sequences
		// possible values: 'dots', 'progress', 'junit', 'teamcity'
		// CLI --reporters progress
        reporters: ['progress', 'junit', 'coverage', 'html'],

        junitReporter: {
            // will be resolved to basePath (in the same way as files/exclude patterns)
            outputFile: 'test-results.xml',
			outputDir: 'test/frontend/'
        },
		htmlReporter: {
			outputFile: 'test/frontend/units.html',
				
			// Optional 
			pageTitle: 'G2moku Frontend Unit Tests',
			subPageTitle: 'Multiplayer game, like gomoku'
		},
		coverageReporter: {
			// cf. http://gotwarlost.github.com/istanbul/public/apidocs/
			type: 'html',
			dir: 'coverage/'
		},
        preprocessors: {
            '_site/assets/js/**/*.js': 'coverage'
        },
		
		plugins: [
		  'karma-mocha',
		  'karma-requirejs',
		  'karma-chai',
		  'karma-junit-reporter',
          'karma-coverage',
		  'karma-htmlfile-reporter',
		  'karma-chrome-launcher',
		  'karma-firefox-launcher',
		  'karma-safari-launcher'
		],

        port: 9876,
        colors: true,
        autoWatch: true,
        singleRun: false,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        browsers: ['Chrome', 'Firefox', 'Safari']

    });
};