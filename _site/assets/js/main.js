require.config({
	baseUrl: '/assets/js/',
	paths: {
		'jquery': 'libs/jquery/jquery.min',
		'bootstrap':  'libs/bootstrap/bootstrap.min',
		'prototype': 'libs/prototype/prototype',
		'phaser': 'libs/phaser/phaser.min',
		'utils': 'utils',
		'exceptions': 'modules/exceptions',
		'gameTiles':  'modules/gameTiles',
		'AbstractPlayer':  'classes/AbstractPlayer',
		'Player':  'classes/frontend/Player',
		'GameTile':  'classes/GameTile',
		//'Timer':  'classes/Timer',
		'G2moku':  'G2moku',
	},
	shim: {
		'prototype': {
			exports: 'Prototype'
		},
		'phaser': {
			exports: 'Phaser'
		},
		'bootstrap': {
			deps: ['jquery']
		},
		// 'AbstractPlayer': {
			// deps: ['utils', 'GameTile'],
			// exports: 'AbstractPlayer'
		// },
		'Player': {
			//deps: ['AbstractPlayer'],
			exports: 'Player'
		},		
		'G2moku': {
			deps: ['utils', 'phaser', 'GameTile', 'jquery', 'bootstrap', 'gameTiles', 'exceptions'],
			exports: 'g2moku'
		},
		'GameTile': {
			deps: ['utils'],
			exports: 'GameTile'
		},
		'gameTiles': {
			deps: ['GameTile']
		}
	},
});
require([
  // Load our app module and pass it to our definition function
  'G2moku', 'jquery'
], function(g2moku, $){
	g2moku.game.state.add('GameState', g2moku.gameState);
	g2moku.game.state.start('GameState');
	g2moku.$gameModal = $('#game-modal');
	g2moku.$gameRules = $('#game-rules');
	g2moku.$gameStatistics = $('#game-statistics');
	g2moku.$gameModal.modal({
		backdrop: 'static'
	});
	// g2moku.$gameModal.find('.btn-add-player').on('click', function(e){
		// g2moku.makeGameMenuPlayerRow(g2moku.$gameModal.find('.game-mode.player-vs-player .player').length + 1, true);
		// g2moku.$gameModal.find('.btn-add-player').not($(this)).removeClass('btn-add-player').addClass('btn-remove-player');
		// e.preventDefault();
	// });
	//ON PLAY GAME BUTTON CLICK
	g2moku.$gameModal.find('.btn-play-game').on('click', function(e){
		var errors = [
				"Choose playing tile",
				"Maximum of alowed players exceeded"
			],
			data = [];
		if(g2moku.gameErrors.gameMenu.length > 0) {
			g2moku.gameErrors.gameMenu.each(function(e, i){
				e.hideAlert();// would be better if after animation end, it deletes itself
			});
			g2moku.gameErrors.gameMenu = [];
		}
		g2moku.$gameModal.find('.game-mode.player-vs-player .player').each(function(i, e){
			var $input = $(this).find("input.input-player-name"),
				$this = $(this),
				selectedTile = g2moku.gameTiles.selectedTile($this);				
			try {
				if(selectedTile == null) throw new g2moku.exceptions.GameFormException("Choose tile", $input[0]);
				if($input.val().length == 0) throw new g2moku.exceptions.GameFormException("Please type player name", $input[0]);
				if($input.val().length <= 4) throw new g2moku.exceptions.GameFormException("Player name must be more than 4", $input[0]);
				data.push({
					tile: selectedTile,
					tileIndex: selectedTile.index ? selectedTile.index : 0,
					input: $input.val()
				});
			} catch(e) {
				if(e instanceof g2moku.exceptions.GameFormException) {
					e.insertAlert($this.children());
					g2moku.gameErrors.gameMenu.push(e);
				}
			}
		});//(e instanceof TypeError)
		if(g2moku.gameErrors.gameMenu.length == 0) {
			g2moku.$gameModal.modal('hide');
			console.log(data);
			g2moku.gameStart('playerVSplayer', data);			
		}		
		e.preventDefault();
	});
	g2moku.$gameModal.on('click', '.btn-player-tile', function(e){
		var $tile = $(this),
			$player = $tile.parent().parent().parent().parent(),
			players = g2moku.$gameModal.find('.game-mode.player-vs-player').children().length;
		$tile.toggleClass('player-tile-selected');
		//if()
		if($tile.hasClass('player-tile-selected')) {
			g2moku.gameTiles.selectTile($tile, $player);
		} else {
			g2moku.gameTiles.deselectTile($tile);
		}
		g2moku.reinitPlayerTiles(g2moku.gameTiles.availableTiles.slice(0, players));
		e.preventDefault();
	});
	g2moku.$gameModal.on('click', '.btn-add-player, .btn-remove-player', function(e){
		var players = g2moku.$gameModal.find('.game-mode.player-vs-player').children().length;
		if($(this).parent().parent().parent().index() !== g2moku.MAX_PLAYERS - 1) {
			$(this).toggleClass('btn-remove-player btn-add-player');
			if($(this).hasClass('btn-remove-player')) {
				if(players < g2moku.MAX_PLAYERS) {
					g2moku.makeGameMenuPlayerRow(g2moku.gameTiles.availableTiles.slice(0, players + 1), true);
					g2moku.reinitPlayerTiles(g2moku.gameTiles.availableTiles.slice(0, players + 1));
				}
			} else {
				$(this).parent().parent().parent().slideUp(250, function(){
					$(this).remove();
				});
				g2moku.reinitPlayerTiles(g2moku.gameTiles.availableTiles.slice(0, players - 1));			
			}
		}
	});
	g2moku.$gameModal.find('.btn-rules').on('click', function(e){
		g2moku.$gameRules.slideToggle(300);
		e.preventDefault();
	});	
	g2moku.$gameModal.find('.btn-statistics').on('click', function(e){
		g2moku.$gameStatistics.slideToggle(300);
		e.preventDefault();
	});
	g2moku.$gameModal.find('.btn-play').on('click', function(e){
		var $players = g2moku.$gameModal.find('.game-mode.player-vs-player'),
			$bar = g2moku.$gameModal.find('.modal-header .title');
		g2moku.gameTiles.parseFromServer(function(gameTiles){
			var tiles = gameTiles.availableTiles;
			$players.empty();
			g2moku.makeGameMenuPlayerRow(tiles.slice(0, 2), false);
			g2moku.makeGameMenuPlayerRow(tiles.slice(0, 2), true);
			$players.slideToggle({
				duration: 450
				//easing: 'easeInOutExpo'
			});
			$bar.fadeToggle(350);
			g2moku.$gameModal.find('.btn-play-game').fadeToggle(350);
			//g2moku.$gameModal.modal('hide');
			//g2moku.gameStart('playerVSplayer');
			console.log(g2moku);
		});
		//map.setTileSize(20, 20);
		// map.replace(24, 46);
		// map.replace(12, 34); 
		// setInterval(function(){
			// g2moku.map.forEach(function(tile){
				// console.log(tile.x + "x" + tile.y);
				// g2moku.map.putTile(0, tile.x, tile.y);
			// }, g2moku.game, 0, 0, g2moku.map.width, g2moku.map.height);
		// });
		//map.removeAllLayers();
		e.preventDefault();
	});
});