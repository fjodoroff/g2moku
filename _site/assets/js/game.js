jQuery(document).ready(function(){
	var newG2moku = {
		debug: true,
		$gameModal: null,
		$playerBoxes: jQuery('.player-boxes'),
		$box: null,
		game: new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO),
		map: null,
		MAX_PLAYERS: 4,
		layer: null,
		cursors: null,
		marker: null,
		currentTile: null,
		sprites: null,
		canvas: null,
		gameStarted: false,
		gameErrors: {
			gameMenu: []
		},
		players: {
			arr: [],
			playing: [],
			currentPlaying: false,
			willPlay: function(player){
				var newArr = [player];
				for(var i = 0; i < this.playing.length; i++) {
					newArr.push(this.playing[i]);
				}
				this.playing = newArr;
			},		
			getLast: function(){
				return this.playing.length > 0 ? this.playing[this.playing.length - 1] : false;
			},
			next: function(){
				if(this.playing.length == 0 && g2moku.gameStarted) this.playing = this.arr;
				//this.playing[this.playing.length - 1].startTimer();
				return this.playing.length > 0 && g2moku.gameStarted ? this.playing.pop() : false;
			},
			parseFromGameModal: function(data){
				var pl = this;
				data.each(function(i, e){
					pl.arr.push(new Player({
						name: e.input,
						playingTileIndex: 23
					}));				
				});
				if(g2moku.gameStarted) this.playing = this.arr;
				return this.arr;
			},
		},
		gameState: {
			preload: function(){
				var g = g2moku;
				//game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
				g.game.load.tilemap('map', 'assets/maps/board.csv', null, Phaser.Tilemap.CSV);
				g.game.load.image('tiles', 'assets/tiles/gridtiles.png');
				//game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);
				//game.load.spritesheet('citizenmale', 'assets/sprites/citizenmale.png', 64, 64, 10);
			},
			create: function(){
				var g = g2moku;
				
				// var style = { font: "65px Arial", fill: "#ff0044", align: "center" };
				// var text = g.game.add.text(g.game.world.centerX, g.game.world.centerY, "- phaser -\nwith a sprinkle of\npixi dust", style);
				
				// text.anchor.set(0.5);
				// text.alpha = 0.1;
				// g.game.add.tween(text).to( { alpha: 1 }, 2000, "Linear", true);
				
				g.game.physics.startSystem(Phaser.Physics.ARCADE);

				g.map = g.game.add.tilemap('map', 32, 32);

				g.map.addTilesetImage('tiles');
				g.currentTile = g.map.getTile(0, 0);
				
				//map.setCollisionBetween(1, 12);

				g.layer = g.map.createLayer(0);

				g.layer.resizeWorld();

				//  Our painting marker
				g.marker = g.game.add.graphics();
				g.marker.lineStyle(2, 0xffffff, 1);
				g.marker.drawRect(0, 0, 32, 32);

				g.sprites = g.game.add.group();
				//game.time.events.loop(1050, this.createSprite, this);
				
				g.game.input.addMoveCallback(this.updateMarker, this);

				g.game.input.onDown.add(this.clickHandler, this);

				g.cursors = g.game.input.keyboard.createCursorKeys();
				
				//g.sprite = g.game.add.sprite(40, 100, 'ms');
				console.log(g.map.width);
						
				g.canvas = window.document.getElementsByTagName('canvas')[0],
					prevX = 0, prevY = 0, mouseDown = false;
			
				g.canvas.addEventListener('touchstart',function(e){
					prevX = e.changedTouches[0].screenX;
					prevY = e.changedTouches[0].screenY;
				});
			
				g.canvas.addEventListener('mousedown',function(e){
					mouseDown = true;
					prevX = e.screenX;
					prevY = e.screenY;
				});
			
				g.canvas.addEventListener('touchmove',function(e){
					e.preventDefault();
					g.game.camera.x+= prevX - e.changedTouches[0].screenX;
					prevX = e.changedTouches[0].screenX;
					g.game.camera.y+= prevY - e.changedTouches[0].screenY;
					prevY = e.changedTouches[0].screenY;
				});
			
				g.canvas.addEventListener('mousemove',function(e){
					if(mouseDown){
						e.preventDefault();
						g.game.camera.x+= prevX - e.screenX;
						prevX = e.screenX;
						g.game.camera.y+= prevY - e.screenY;
						prevY = e.screenY;
					}
				});
			
				g.canvas.addEventListener('mouseup',function(e){
					mouseDown = false;
				});
			
				g.canvas.addEventListener('mouseleave',function(e){
					mouseDown = false;
				});

			},
			render: function(){
				var g = g2moku;
				if(g.debug) {
					g.game.debug.cameraInfo(g.game.camera, 32, 32);
					g.game.debug.inputInfo(32, 130);
					//g.game.debug.spriteInputInfo(g.sprite, 32, 130);
					g.game.debug.pointer(g.game.input.activePointer );
				}
			},
			update: function(){
				var g = g2moku;
				g.marker.x = g.layer.getTileX(g.game.input.activePointer.worldX) * 32;
				g.marker.y = g.layer.getTileY(g.game.input.activePointer.worldY) * 32;
				
				//g.sprites.setAll('x', 1, true, true, 1);

				//g.sprites.forEach(g.checkSprite, this, true);
				
				if (g.cursors.left.isDown)
				{
					g.game.camera.x -= 4;
				}
				else if (g.cursors.right.isDown)
				{
					g.game.camera.x += 4;
				}

				if (g.cursors.up.isDown)
				{
					g.game.camera.y -= 4;
				}
				else if (g.cursors.down.isDown)
				{
					g.game.camera.y += 4;
				}
				//if(g.gameStarted && g.players.currentPlaying !== false) g.game.debug.text('Player move' + g.players.currentPlaying.name, 300, 300);
			},
			getTileProperties: function(){
				var g = g2moku;
				var x = g.layer.getTileX(g.game.input.activePointer.worldX);
				var y = g.layer.getTileY(g.game.input.activePointer.worldY);

				// var tile = map.getTile(x, y, layer);

				// tile.properties.wibble = true;
				//console.log(g.map.getTile(g.layer.getTileX(g.marker.x), g.layer.getTileY(g.marker.y)));
				
			},
			clickHandler: function(){
				var g = g2moku;
				if(g.gameStarted) { // IF Game started
					if(g.players.currentPlaying === false) {//first turn
						g.players.currentPlaying = g.players.next();
						g.players.currentPlaying.startTimer();
					} else {
						g.gameState.getTileProperties();
						var tile = g.map.getTile(g.layer.getTileX(g.marker.x), g.layer.getTileY(g.marker.y));
						g.players.currentPlaying.moveToTile(tile);
						g.players.willPlay(g.players.currentPlaying);
						g.players.currentPlaying = g.players.next();//take next player in queue
						g.players.currentPlaying.startTimer();
					}
										
					// 
					// if(typeof g.players.currentPlaying !== false) {
						// 
					// };
					// console.log(g.players.currentPlaying);
					
					// if() {
						
						
						
					// }
					// g.players.currentPlaying = g.players.next();
					// if(typeof g.players.currentPlaying !== false) {
						// g.players.currentPlaying.startTimer();
					// }
				}
			},
			updateMarker: function() {
				var g = g2moku;
				g.marker.x = g.layer.getTileX(g.game.input.activePointer.worldX) * 32;
				g.marker.y = g.layer.getTileY(g.game.input.activePointer.worldY) * 32;
			}, 
			createSprite: function() {
				var g = g2moku;
				var mummy = g.sprites.create(0, g.game.world.randomY, 'mummy');
				mummy.scale.x = 2;
				mummy.scale.y = 2;
				var citizen = g.sprites.create(0, g.game.world.randomY, 'citizenmale');
				mummy.animations.add('walk');
				citizen.animations.add('walk', [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]);
				mummy.play('walk', 10, true);
				//citizen.play('walk', 10, true);
				g.game.add.tween(citizen).to({ x: g.game.width }, 5000, Phaser.Easing.Exponential.InOut, true);
			}
		},
		checkSprite: function(sprite) {
			var g = g2moku;
			try {
				if(sprite.x > g.game.width) {
					rip++;
					g.sprites.remove(sprite, true);
				}
			} catch(e) {
				console.log(sprite);
			}

		},
		preparePlayerBlock: function(player, i){ //adding jquery player box, as a additional property
			var corners = [
				'player-box-top-left', 'player-box-top-right', 'player-box-bottom-left', 'player-box-bottom-right'
			];
			player.$box = jQuery('<div class="player-box ' + corners[i] + '" style="display: none;">' +
				'<div class="avatar">' +
					'<span>' + (player.name.substr(0, 2) + player.name.substr(-1, 1)) + '</span>' +
				'</div>' +
				'<div class="bottom-panel">' +
					'<span class="label label-primary time-elapsed">00:00:00</span>' +
				'</div>' +
				'<div class="playing-tile">' +
					'<img src="assets/img/square.png">' +
				'</div>' +
			'</div>');
			jQuery('body').prepend(player.$box);
			player.$box.fadeIn(300);
		},
		getGameMenuPlayerRowTileButtonHTML: function(object){
			var btnHTML = '<button type="button" class="btn btn-default square-btn btn-player-tile">' +
					'<img src="assets/img/square.png">' +
				'</button>'; 
			if(isObject(object)) {
				return btnHTML;
			} else {
				
			}
		},
		makeGameMenuPlayerRow: function(tilesNum, addButton) {//in second iteration tilesNum will be depreceted
			var buttonsContent = '',
				addButtonContent = '',
				uniqNumber = +new Date(),
				numbers = [
					"one", "two", "three", "four", "five", "six"
				];
			for(var i = 0; i < tilesNum; i++) {
				buttonsContent += g2moku.getGameMenuPlayerRowTileButtonHTML({});
			}
			if(addButton) {
				addButtonContent += ('<button type="button" class="btn btn-default square-btn-right btn-add-player pull-right">' +
				'</button>');
			}
			var $playerRow = jQuery('<div class="player col-xs-12 col-sm-12 col-md-12" style="display: none">' +
				'<div class="row">' +
					'<div class="col-xs-12 col-sm-5 col-md-5">' +
							'<label class="labelSize" for="player-input-' + uniqNumber + '">Player ' + numbers[tilesNum - 1] + ':</label>' +
							'<input type="text" class="form-control input-player-name" id="player-input-' + uniqNumber + '" placeholder="Player name...">' +
					'</div>' +
					'<div class="col-xs-12 col-sm-7 col-md-7 player-square-btns"><div class="left-buttons">' + buttonsContent + "</div>" +
						'<button type="button" class="btn btn-default square-btn-right pull-right">' +
							'<img src="assets/img/gear.png">' +
						'</button>' + addButtonContent +
					'</div>' +                                                                                    
				'</div>' +									
			'</div>');
			// if(addButton) {
				// // $playerRow.find('button:last-of-type').on('click', function(e){
					// // $(this).toggleClass('btn-add-player btn-remove-player');
					// // if($(this).hasClass('btn-add-player')) {
						// // g2moku.makeGameMenuPlayerRow(g2moku.$gameModal.find('.game-mode.player-vs-player .player').length + 1, true);
					// // } else {
						
					// // }
					// // e.preventDefault();
				// // });
			// }
			g2moku.$gameModal.find('.game-mode.player-vs-player').append($playerRow);
			$playerRow.slideDown(300);			
		},
		gameStart: function(gameMode, data){
			var g = this;
			switch (gameMode) {
				case 'playerVSplayer':
					g.gameStarted = true;
					g.players.parseFromGameModal(data);
					//add player box for each playing player.
					g.players.playing.each(function(i, e){
						g2moku.preparePlayerBlock(i, e);				
					});
					//g.players.getLast()
					//while(!this.gameStarted || !this.players.next()) {
					// var player = g.players.next();
					// g.waitMove(player, function(callback){
						// console.log(callback);
					// });
					break
				default:
					break
			}

		},
	};
	//adding properties to g2moku object
	for(var property in newG2moku) {
		g2moku[property] = newG2moku[property];
	}
	g2moku.game.state.add('GameState', g2moku.gameState);
	g2moku.game.state.start('GameState');
	g2moku.$gameModal = jQuery('#game-modal');
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
			var $input = jQuery(this).find("input.input-player-name"),
				$this = jQuery(this);
			try {
				if($input.val().length == 0) throw new g2moku.exceptions.GameFormException("Please type player name", $input[0]);
				if($input.val().length <= 4) throw new g2moku.exceptions.GameFormException("Player name must be more than 4", $input[0]);
				data.push({
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
			g2moku.gameStart('playerVSplayer', data);			
		}		
		e.preventDefault();
	});
	g2moku.$gameModal.on('click', '.btn-add-player, .btn-remove-player', function(e){
		var players = g2moku.$gameModal.find('.game-mode.player-vs-player').children().length;
		if(jQuery(this).parent().parent().parent().index() !== g2moku.MAX_PLAYERS - 1)  {
			jQuery(this).toggleClass('btn-remove-player btn-add-player');
			if(jQuery(this).hasClass('btn-remove-player')) {
				if(players < g2moku.MAX_PLAYERS) {
					g2moku.makeGameMenuPlayerRow(players + 1, true);
					
					g2moku.$gameModal.find('.game-mode.player-vs-player').children().each(function(i, e){
						var buttonsNum = jQuery(this).parent().children().length,
							newButtons = '';
						for(var k = 0; k < (jQuery(this).hasClass('btn-remove-player') ? players - 1: players + 1); k++) {
							newButtons += g2moku.getGameMenuPlayerRowTileButtonHTML({});
						}
						jQuery(this).find('.left-buttons').html(newButtons);			
					});
				}
			} else {
				jQuery(this).parent().parent().parent().slideUp(250, function(){
					$(this).remove();
				});
				g2moku.$gameModal.find('.game-mode.player-vs-player').children().each(function(i, e){
				var buttonsNum = jQuery(this).parent().children().length,
					newButtons = '';
				for(var k = 0; k < players - 1; k++) {
					newButtons += g2moku.getGameMenuPlayerRowTileButtonHTML({});
				}
				jQuery(this).find('.left-buttons').html(newButtons);			
			});
			}
		}
	});
	g2moku.$gameModal.find('.btn-play').on('click', function(e){
		var $players = g2moku.$gameModal.find('.game-mode.player-vs-player'),
			$bar = g2moku.$gameModal.find('.modal-header .title');
			$players.empty();
		g2moku.makeGameMenuPlayerRow(1, false);
		g2moku.makeGameMenuPlayerRow(2, true);
		$players.slideToggle({
			duration: 450
			//easing: 'easeInOutExpo'
		});
		$bar.fadeToggle(350);
		g2moku.$gameModal.find('.btn-play-game').fadeToggle(350);
		//g2moku.$gameModal.modal('hide');
		//g2moku.gameStart('playerVSplayer');
		console.log(g2moku);
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