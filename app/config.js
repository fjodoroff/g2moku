var dirs = __dirname.split(__dirname.indexOf('/') != -1 ? '/' : '\\');
var tempDirs = dirs;
global.onProduction = false;
tempDirs.pop();
global.APP_PATH = tempDirs.join(__dirname.indexOf('/') != -1 ? '/' : '\\');
console.log(dirs);
console.log(global.APP_PATH);
for(var i = 0; i < dirs.length; i++) {
    //if(dirs[i].indexOf('axive') !== -1) global.onProduction = true;
}
global.APP_FOLDER = global.onProduction ? '/' : '/app/';
define({
    paths: {
        //Classes
        'Server': global.APP_FOLDER + 'classes/Server',
        'Game': global.APP_FOLDER + 'classes/Game',
        'AbstractPlayer' : global.APP_PATH + '/_site/assets/js/classes/AbstractPlayer',
        'Player': global.APP_PATH + '/_site/assets/js/classes/backend/Player',
        'Players':  global.APP_PATH + '/_site/assets/js/classes/backend/Players',
        'AbstractPlayers':  global.APP_PATH + '/_site/assets/js/classes/AbstractPlayers',
        'AbstractPlayerMove': global.APP_PATH + '/_site/assets/js/classes/AbstractPlayerMove',
        'PlayerMove': global.APP_PATH + '/_site/assets/js/classes/backend/PlayerMove',
        'AbstractG2moku': global.APP_PATH + '/_site/assets/js/classes/AbstractG2moku',
        'AbstractGame': global.APP_PATH + '/_site/assets/js/classes/AbstractGame',
        'G2moku': global.APP_PATH + '/_site/assets/js/classes/backend/G2moku',
        'Timer': global.APP_PATH + '/_site/assets/js/classes/Timer',
        'GameTile': global.APP_PATH + '/_site/assets/js/classes/GameTile',
        //Modules
        'routes': global.APP_FOLDER + 'modules/routes',
        'games': global.APP_FOLDER + 'modules/games',
        'exceptions' : global.APP_PATH + '/_site/assets/js/modules/exceptions',
        'gameTiles': global.APP_PATH + '/_site/assets/js/modules/gameTiles',
        //Libraries
        'prototype': global.APP_PATH + '/node_modules/prototype/lib/index',
        'utils': global.APP_PATH + '/_site/assets/js/utils',
        'base64': global.APP_PATH + '/node_modules/base-64/base64'
    },
    basePath: '../',
    publicPath: './'
});