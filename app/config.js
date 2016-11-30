const path = require('path');
var dirs = __dirname.split(path.sep);
var tempDirs = dirs;
global.onProduction = false;
tempDirs.pop();
global.APP_PATH = tempDirs.join(path.sep);
global.BASE_PATH = './';
console.log(dirs);
console.log(global.APP_PATH);
// for(var i = 0; i < dirs.length; i++) {
//     //if(dirs[i].indexOf('axive') !== -1) global.onProduction = true;
// }
//global.APP_FOLDER = global.onProduction ? '/' : '/app/';
global.APP_FOLDER = './';
define({
    paths: {
        //Classes
        'Server': path.join(global.APP_FOLDER, 'classes/Server'),
        'Game': path.join(global.APP_FOLDER, 'classes/Game'),
        'AbstractPlayer' : path.join(global.APP_PATH, '/_site/assets/js/classes/AbstractPlayer'),
        'Player': path.join(global.APP_PATH, '/_site/assets/js/classes/backend/Player'),
        'Players':  path.join(global.APP_PATH, '/_site/assets/js/classes/backend/Players'),
        'AbstractPlayers':  path.join(global.APP_PATH, '/_site/assets/js/classes/AbstractPlayers'),
        'AbstractPlayerMove': path.join(global.APP_PATH, '/_site/assets/js/classes/AbstractPlayerMove'),
        'PlayerMove': path.join(global.APP_PATH, '/_site/assets/js/classes/backend/PlayerMove'),
        'AbstractG2moku': path.join(global.APP_PATH, '/_site/assets/js/classes/AbstractG2moku'),
        'AbstractGame': path.join(global.APP_PATH, '/_site/assets/js/classes/AbstractGame'),
        'G2moku': path.join(global.APP_PATH, '/_site/assets/js/classes/backend/G2moku'),
        'Timer': path.join(global.APP_PATH, '/_site/assets/js/classes/Timer'),
        'GameTile': path.join(global.APP_PATH, '/_site/assets/js/classes/GameTile'),
        //Modules
        'routes': path.join(global.APP_FOLDER, 'modules/routes'),
        'games': path.join(global.APP_FOLDER, 'modules/games'),
        'exceptions' : path.join(global.APP_PATH, '/_site/assets/js/modules/exceptions'),
        'gameTiles': path.join(global.APP_PATH, '/_site/assets/js/modules/gameTiles'),
        //Libraries
        'prototype': '../node_modules/prototype/lib/index',
        'utils': path.join(global.APP_PATH, '/_site/assets/js/utils'),
        'base64': '../node_modules/base-64/base64'
    },
    basePath: '../',
    publicPath: './'
});