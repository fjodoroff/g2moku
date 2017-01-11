(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.cordovaBsPlugin = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (__dirname){
var path = require('path');
var fs = require('fs');

/**
 * Installs the dependencies when this is installed as a Cordova plugin hook 
 * or as a project hook
 **/
module.exports = function(context) {
    var Q = context.requireCordovaModule('q');
    var npm = context.requireCordovaModule('npm');

    var package = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));

    return Q.ninvoke(npm, 'load', {
        loaded: false
    }).then(function() {
        return Q.ninvoke(npm.commands, 'install', Object.keys(package.dependencies).map(function(p) {
            return p + '@' + package.dependencies[p];
        }));
    });
};

}).call(this,"/_dev2\\g2moku\\hooks\\cordova-plugin-browsersync\\lib")
},{"fs":undefined,"path":undefined}],2:[function(require,module,exports){
var path = require('path');
var glob = require('glob');

var Patcher = require('./utils/Patcher');
var browserSyncServer = require('./utils/browserSyncServer');

function parseOptions(opts) {
    var result = {};
    opts = opts || [];
    opts.forEach(function(opt) {
        var parts = opt.split(/=/);
        result[parts[0].replace(/^-+/, '')] = parts[1] || true;
    });
    return result;
}

module.exports = function(context) {
    var options = parseOptions(context.opts.options.argv);

    if (typeof options['live-reload'] === 'undefined') {
        return;
    }

    // TODO - Add back ignored option
    // TODO - Enable live reload servers

    var platforms = ['android', 'ios', 'browser'];
    var patcher = new Patcher(context.opts.projectRoot, platforms);
    var changesBuffer = [];
    var changesTimeout;
    var bs = browserSyncServer(function(defaults) {
        defaults.files.push({
            match: ['src/**/*.js'],
            fn: function(event, file) {
                console.log("event", event, file);
                if (event === 'change') {
                    changesBuffer.push(file);
                    if(changesTimeout){
                      clearTimeout(changesTimeout);
                    }
                    changesTimeout = setTimeout(function(){
                      context.cordova.raw.prepare().then(function() {
                          patcher.addCSP();
                          console.info(changesBuffer);
                          bs.reload(changesBuffer);
                          changesBuffer = [];
                      });
                    },200);
                }
            }
        });
        defaults.server = {
            baseDir: context.opts.projectRoot,
            routes: {},
            middleware: function (req, res, next) {
                res.setHeader('Access-Control-Allow-Origin', '*');
                next();
            }
        }
        platforms.forEach(function(platform) {
            var www = patcher.getWWWFolder(platform);
            defaults.server.routes['/' + www.replace('\\','/')] = path.join(context.opts.projectRoot, www);
        });

        return defaults;
    }, function(err, servers) {
        patcher.patch({
            servers: servers
        });
    });
}

},{"./utils/Patcher":4,"./utils/browserSyncServer":5,"glob":undefined,"path":undefined}],3:[function(require,module,exports){
/**
 * A project hook is built from this file using browserify
 * Copy this to your cordova project and add the following to config.xml
 * <hook type="after_prepare" src="browserSync.hook.js" /> 
 */
module.exports = function(context) {
	var pluginHook = require('./pluginHook');
	var npmInstall = require('./npmInstall');

	return npmInstall(context).then(function() {
		return pluginHook(context);
	});
}
},{"./npmInstall":1,"./pluginHook":2}],4:[function(require,module,exports){
(function (__dirname){
var path = require('path');
var fs = require('fs');
var url = require('url');

var glob = require('glob');
var et = require('elementtree');
var cheerio = require('cheerio');
var Policy = require('csp-parse');
var plist = require('plist');


var WWW_FOLDER = {
    android: 'assets/www',
    ios: 'www',
    browser:'www'
};

var CONFIG_LOCATION = {
    android: 'res/xml',
    ios: '.',
    browser:'.'
};

var START_PAGE = 'browser-sync-start.html';

function parseXml(filename) {
    return new et.ElementTree(et.XML(fs.readFileSync(filename, "utf-8").replace(/^\uFEFF/, "")));
}

function Patcher(projectRoot, platforms) {
    this.projectRoot = projectRoot || '.';
    if (typeof platforms === 'string') {
        platforms = platforms.split(',');
    }
    this.platforms = platforms || ['android', 'ios'];

}

Patcher.prototype.__forEachFile = function(pattern, location, fn) {
    this.platforms.forEach(function(platform) {
        glob.sync(pattern, {
            cwd: path.join(this.projectRoot, 'platforms', platform, location[platform]),
            ignore: '*build/**'
        }).forEach(function(filename) {
            filename = path.join(this.projectRoot, 'platforms', platform, location[platform], filename);
            fn.apply(this, [filename, platform]);
        }, this);
    }, this);
};

Patcher.prototype.addCSP = function() {
    this.__forEachFile('**/index.html', WWW_FOLDER, function(filename, platform) {
        var pageContent = fs.readFileSync(filename, 'utf-8');
        var $ = cheerio.load(pageContent, {
            decodeEntities: false
        });
        var cspTag = $('meta[http-equiv=Content-Security-Policy]');
        var policy = new Policy(cspTag.attr('content'));
        policy.add('default-src', 'ws:');
        policy.add('default-src', "'unsafe-inline'");
        cspTag.attr('content', function() {
            return policy.toString();
        });
        fs.writeFileSync(filename, $.html());
        //console.log('Added CSP for ', filename);
    });
};

Patcher.prototype.copyStartPage = function(servers) {
    var html = fs.readFileSync(path.join(__dirname, 'browser-sync-start.html'), 'utf-8');
    this.__forEachFile('**/index.html', WWW_FOLDER, function(filename, platform) {
        var dest = path.join(path.dirname(filename), START_PAGE);
        var data = {};
        for (var key in servers) {
            if (typeof servers[key] !== 'undefined') {
                data[key] = url.resolve(servers[key], this.getWWWFolder(platform) + '/index.html');
            }
        }
        fs.writeFileSync(dest, html.replace(/__SERVERS__/, JSON.stringify(data)));
        // console.log('Copied start page ', servers);
    });
};

Patcher.prototype.updateConfigXml = function() {
    return this.__forEachFile('**/config.xml', CONFIG_LOCATION, function(filename, platform) {
        configXml = parseXml(filename);
        var contentTag = configXml.find('content[@src]');
        if (contentTag) {
            contentTag.attrib.src = START_PAGE;
        }
        // Also add allow nav in case of
        var allowNavTag = et.SubElement(configXml.find('.'), 'allow-navigation');
        allowNavTag.set('href', '*');
        fs.writeFileSync(filename, configXml.write({
            indent: 4
        }), "utf-8");
        //console.log('Set start page for %s', filename);
    });
};

Patcher.prototype.fixATS = function() {
    return this.__forEachFile('**/*Info.plist', CONFIG_LOCATION, function(filename) {
        try {
            var data = plist.parse(fs.readFileSync(filename, 'utf-8'));
            data.NSAppTransportSecurity = {
                NSAllowsArbitraryLoads: true
            };
            fs.writeFileSync(filename, plist.build(data));
            //console.log('Fixed ATS in ', filename);
        } catch (err) {
            console.log('Error when parsing', filename, err);
        }
    });
};

Patcher.prototype.patch = function(opts) {
    opts = opts || {};
    this.copyStartPage(opts.servers);
    this.updateConfigXml();
    this.fixATS();
    this.addCSP();
};

Patcher.prototype.getWWWFolder = function(platform) {
    return path.join('platforms', platform, WWW_FOLDER[platform]);
};

module.exports = Patcher;

}).call(this,"/_dev2\\g2moku\\hooks\\cordova-plugin-browsersync\\lib\\utils")
},{"cheerio":undefined,"csp-parse":undefined,"elementtree":undefined,"fs":undefined,"glob":undefined,"path":undefined,"plist":undefined,"url":undefined}],5:[function(require,module,exports){
var path = require('path');
var fs = require('fs');

var BrowserSync = require('browser-sync');

/**
 * Private function that adds the code snippet to deal with reloading
 * files when they are served from platform folders
 */
function monkeyPatch() {
    var script = function() {
        window.__karma__ = true;
        (function patch() {
            if (typeof window.__bs === 'undefined') {
                window.setTimeout(patch, 500);
            } else {
                var oldCanSync = window.__bs.prototype.canSync;
                window.__bs.prototype.canSync = function(data, optPath) {
                var index = window.location.pathname.indexOf('/www');
                if (index!==-1) {
                    data.url = window.location.pathname.substr(0, index) + data.url.substr(data.url.indexOf('/www'));
                }
                return oldCanSync.apply(this, [data, optPath]);
                };
            }
        }());
    };
    return '<script>(' + script.toString() + '());</script>';
}

/**
 * Starts the browser sync server, and when files are changed, does the reload
 * @param {Object} opts - Options Object to be passed to browserSync. If this is a function, the function is called with default values and should return the final options to be passed to browser-sync
 * @param {Function} cb - A callback when server is ready, calls with (err, servr_hostname)
 */
module.exports = function(opts, cb) {
    opts = opts || {};
    var bs = BrowserSync.create();

    var defaults = {
        logFileChanges: true,
        logConnections: true,
        open: false,
        snippetOptions: {
            rule: {
                match: /<\/body>/i,
                fn: function(snippet, match) {
                    return monkeyPatch() + snippet + match;
                }
            }
        },
        minify: false,
        watchOptions: {
            ignoreInitial: true,
            ignored: ['node_modules/']
        },
        files: [],
    };

    if (typeof opts === 'function') {
        opts = opts(defaults);
    } else {
        for (var key in defaults) {
            if (typeof opts[key] === 'undefined') {
                opts[key] = defaults[key];
            }
        }
    }
    // opts.files.push("!node_modules/");
    opts.files[0].options = {
        ignored: "node_modules/"
    };
    console.log("OPTIONS", JSON.stringify(opts));
    bs.init(opts, function(err, bs) {
        var urls = bs.options.getIn(['urls']);
        var servers = {};
        ['local', 'external', 'tunnel'].forEach(function(type) {
            servers[type] = urls.get(type);
        })
        cb(err, servers);
    });
    return bs;
};

},{"browser-sync":undefined,"fs":undefined,"path":undefined}]},{},[3])(3)
});