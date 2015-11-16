define({
    paths: {
		//Classes
        'Server': 'app/classes/Server',
        'Game': 'app/classes/Game',
		'AbstractPlayer' : '_site/assets/js/classes/AbstractPlayer',
        'Player': '_site/assets/js/classes/backend/Player',
        'AbstractPlayerMove': '_site/assets/js/classes/AbstractPlayerMove',
        'PlayerMove': '_site/assets/js/classes/backend/PlayerMove',
        'AbstractG2moku': '_site/assets/js/classes/AbstractG2moku',
        'G2moku': '_site/assets/js/classes/backend/G2moku',
        'Timer': '_site/assets/js/classes/Timer',
        'GameTile': '_site/assets/js/classes/GameTile',
        //Modules
		'routes': 'app/modules/routes',
        'games': 'app/modules/games',
		'exceptions' : '_site/assets/js/modules/exceptions',
        'gameTiles': '_site/assets/js/modules/gameTiles',
        //Libraries
        'prototype': 'node_modules/prototype/lib/index',
        'utils': '_site/assets/js/utils',
		'base64': 'node_modules/base-64/base64'
    },
    basePath: './' 
});