require = require('amdrequire');
require(['./config.js'], function(config){
    // Set basepaths first
    config.basePath = __dirname;
    // config.publicPath = __dirname + '/public';
    require.config(config);
});
require(['Server'], function(Server){
    var server = new Server(2000);
    return server;
});