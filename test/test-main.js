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
			'prototype': '_site/assets/js/libs/prototype/prototype',
			'phaser': '_site/assets/js/libs/phaser/phaser.min',
			'utils': '_site/assets/js/utils',
			'chai':  'node_modules/chai/chai',
			'player':  '_site/assets/js/modules/Player',
			'gameTile':  '_site/assets/js/modules/GameTile'
		},
		shim: {
			'prototype': {
				exports: 'Prototype'
			},
			'phaser': {
				exports: 'Phaser'
			},
			'player': {
				deps: ['utils', 'gameTile', 'phaser'],
				exports: 'Player'
			},
			'gameTile': {
				deps: ['utils'],
				exports: 'GameTile'
			}
		},
		// ask Require.js to load these files (all our tests)
		deps: specFiles,

		// start test run, once Require.js is done
		callback: requirejsCallback
	});
})();