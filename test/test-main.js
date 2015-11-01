(function() {

  var specFiles = null;
  var baseUrl = '';
  var requirejsCallback = null;

  // if invoked in karma-runner environment
  if (typeof window != 'undefined' && window.__karma__ != undefined) {
    // Karma serves files from '/base'
    baseUrl = '/base';
    requirejsCallback = window.__karma__.start;

    // looking for *_spec.js files
    specFiles = [];
    for (var file in window.__karma__.files) {
      if (window.__karma__.files.hasOwnProperty(file)) {
         if (/Spec\.js$/.test(file)) {
          specFiles.push(file);
        }
      }
    }
  }

	requirejs.config({
		baseUrl: baseUrl,

		paths: {
			'jquery': '_site/assets/js/libs/jquery/jquery.min',
			'jquery.nanoscroller': '_site/assets/js/libs/jquery/jquery.nanoscroller.min',
			'bootstrap':  '_site/assets/js/libs/bootstrap/bootstrap.min',
			'prototype': '_site/assets/js/libs/prototype/prototype',
			'phaser': '_site/assets/js/libs/phaser/phaser.min',
			'utils': '_site/assets/js/utils',
			'exceptions': '_site/assets/js/modules/exceptions',
			'gameTiles':  '_site/assets/js/modules/gameTiles',
			'AbstractPlayer':  '_site/assets/js/classes/AbstractPlayer',
			'AbstractPlayerMove':  '_site/assets/js/classes/AbstractPlayerMove',
			'Player':  '_site/assets/js/classes/frontend/Player',
			'PlayerMove':  '_site/assets/js/classes/frontend/PlayerMove',
			'GameTile':  '_site/assets/js/classes/GameTile',
			'Timer':  '_site/assets/js/classes/Timer',
			'G2moku':  '_site/assets/js/G2moku',
			'chai':  'node_modules/chai/chai',
		},
		shim: { 
			'bootstrap': {
				deps: ['jquery']
			},
			'prototype': {
				exports: 'Prototype'
			},
			'phaser': {
				exports: 'Phaser'
			},
			'GameTile': {
				deps: ['utils'],
				exports: 'GameTile'
			},
			'G2moku': {
				deps: ['utils', 'phaser', 'GameTile', 'jquery', 'bootstrap', 'gameTiles', 'exceptions', 'jquery.nanoscroller'],
				exports: 'g2moku'
			},
		},
		// ask Require.js to load these files (all our tests)
		deps: specFiles,

		// start test run, once Require.js is done
		callback: requirejsCallback
	});
})();