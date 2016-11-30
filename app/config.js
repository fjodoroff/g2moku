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
        'AbstractPlayer' : '/_site/assets/js/classes/AbstractPlayer',
        'Player': '/_site/assets/js/classes/backend/Player',
        'Players':  '/_site/assets/js/classes/backend/Players',
        'AbstractPlayers':  '/_site/assets/js/classes/AbstractPlayers',
        'AbstractPlayerMove': '/_site/assets/js/classes/AbstractPlayerMove',
        'PlayerMove': '/_site/assets/js/classes/backend/PlayerMove',
        'AbstractG2moku': '/_site/assets/js/classes/AbstractG2moku',
        'AbstractGame': '/_site/assets/js/classes/AbstractGame',
        'G2moku': '/_site/assets/js/classes/backend/G2moku',
        'Timer': '/_site/assets/js/classes/Timer',
        'GameTile': '/_site/assets/js/classes/GameTile',
        //Modules
        'routes': global.APP_FOLDER + 'modules/routes',
        'games': global.APP_FOLDER + 'modules/games',
        'exceptions' : '/_site/assets/js/modules/exceptions',
        'gameTiles': '/_site/assets/js/modules/gameTiles',
        //Libraries
        'prototype': '/node_modules/prototype/lib/index',
        'utils': '/_site/assets/js/utils',
        'base64': '/node_modules/base-64/base64'
    },
    basePath: '../',
    publicPath: './'
});