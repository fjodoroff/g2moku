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
			'chai':  'node_modules/chai/chai',
			'Player':  '_site/assets/js/player'
		},

		// ask Require.js to load these files (all our tests)
		deps: specFiles,

		// start test run, once Require.js is done
		callback: requirejsCallback
	});
})();