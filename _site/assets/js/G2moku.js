define(['require', 'Player'], function(require, Player){
    require('prototype'); // Ensure Prototype is present
    var g2moku = (function(g) {
		g.MAX_PLAYERS = 4;
		g.gameTiles = null;
		g.gameTiles = require('gameTiles');
		g.exceptions = require('exceptions');
		g.game = new Phaser.Game('100%', '100%', Phaser.AUTO);	
		g.debug = true;
		g.$gameRules = null;
		g.$gameStatistics = null;
		g.$playerBoxes = jQuery('.player-boxes');
		g.$gameTopBar = jQuery('.game-topbar');
		g.$box = null;
		g.map = null;
		g.layer = null;  
		g.cursors = null;
		g.marker = null;
		g.currentTile = null;
		g.sprites = null;
		g.canvas = null;
		g.gameStarted = false;
		g.gameErrors = {
			gameMenu: []
		};
		g.players = {
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
				console.log('//parsefromgameModal each data');
				console.log(data);
				data.each(function(e, i){
					console.log('//tile i');
					console.log(i);
					console.log('//tile e');
					console.log(e);
					pl.arr.push(new Player({
						name: e.input,
						tile: e.tile,
						//playingTileIndex: e.tileIndex
						playingTileIndex: e.tileIndex
					}));				
				});
				console.log(pl.arr);
				if(g2moku.gameStarted) this.playing = this.arr;
				return this.arr;
			},
		};
		g.gameState = {
			preload: function(){
				//game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
				g.game.load.tilemap('map', 'assets/maps/board.csv', null, Phaser.Tilemap.CSV);
				g.game.load.image('tiles', 'assets/tiles/gridtiles.png');
				//game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);
				//game.load.spritesheet('citizenmale', 'assets/sprites/citizenmale.png', 64, 64, 10);
			},
			create: function(){
				
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
				if(g.debug) {
					g.game.debug.cameraInfo(g.game.camera, 32, 32);
					g.game.debug.inputInfo(32, 130);
					//g.game.debug.spriteInputInfo(g.sprite, 32, 130);
					g.game.debug.pointer(g.game.input.activePointer );
				}
			},
			update: function(){
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
				var x = g.layer.getTileX(g.game.input.activePointer.worldX);
				var y = g.layer.getTileY(g.game.input.activePointer.worldY);

				// var tile = map.getTile(x, y, layer);

				// tile.properties.wibble = true;
				//console.log(g.map.getTile(g.layer.getTileX(g.marker.x), g.layer.getTileY(g.marker.y)));
				
			},
			clickHandler: function(){
				if(g.gameStarted) { // IF Game started
					try {
						if(g.players.currentPlaying === false) {//first turn
							g.players.currentPlaying = g.players.next();
							g.$gameTopBar.find('.game-play-text').html("<span='game-next-player'>" + g.players.currentPlaying.name + "</span>'s turn!");
							g.players.currentPlaying.startTimer();
						} else {
							g.gameState.getTileProperties();
							var tile = g.map.getTile(g.layer.getTileX(g.marker.x), g.layer.getTileY(g.marker.y));
							g.players.currentPlaying.moveToTile(tile, g.layer);
							//Put tile on map
							g.map.putTile(g.players.currentPlaying.playingTile, g.layer.getTileX(g.marker.x), g.layer.getTileY(g.marker.y));
							g.players.willPlay(g.players.currentPlaying);
							g.players.currentPlaying = g.players.next();//take next player in queue
							g.$gameTopBar.find('.game-play-text').html("<span='game-next-player'>" + g.players.currentPlaying.name + "</span>'s turn!");
							g.players.currentPlaying.startTimer();
						}
					} catch(e) {
						
					}
				}
			},
			updateMarker: function() {
				g.marker.x = g.layer.getTileX(g.game.input.activePointer.worldX) * 32;
				g.marker.y = g.layer.getTileY(g.game.input.activePointer.worldY) * 32;
			}, 
			createSprite: function() {
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
		};
		g.checkSprite = function(sprite) {
			try {
				if(sprite.x > g.game.width) {
					rip++;
					g.sprites.remove(sprite, true);
				}
			} catch(e) {
				console.log(sprite);
			}

		};
		g.addDataToPlayerBlock = function(data){
			if(data.history) {
				data.each(function(e, i){
					
				});
			}
		};
		g.preparePlayerBlock = function(player, i){ //adding jquery player box, as a additional property
			var corners = [
				'player-box-top-left', 'player-box-top-right', 'player-box-bottom-left', 'player-box-bottom-right'
			];
			console.log(player);
			player.$box = jQuery('<div class="player-box ' + corners[i] + '" style="display: none;" title="' + player.name + '">' +
				'<div class="avatar">' +
					'<span>' + player.name.substring(0, 3) + '.</span>' +
				'</div>' +
				'<div class="bottom-panel">' +
					'<span class="label label-primary time-elapsed">00:00:00</span>' +
				'</div>' +
				'<div class="playing-tile">' +
					'<img src="' + player.tile.imgPath + '">' +
				'</div>' +
				'<div class="bottom-block">' +
					'<table class="table table-bordered player-game-history" style="display: none">' +
						'<thead>' +
							'<tr><th>#</th><th>Time</th><th>Pos</th></tr>' +
						'</thead>' +
						'<tbody>' +
							// '<tr>'
							  // <th scope="row">1</th>
							  // <td>00:56</td><td>[20; 30]</td>
							// </tr>
						'</tbody>' +
					'</table>' +
				'</div>' +
			'</div>');
			jQuery('body').prepend(player.$box);
			player.$box.fadeIn(300);
		};
		g.makeGameMenuPlayerRow = function(tiles, addButton) {//in second iteration tilesNum will be depreceted
			var buttonsContent = '',
				addButtonContent = '',
				uniqNumber = +new Date(),
				numbers = [
					"one", "two", "three", "four", "five", "six"
				];
			for(var i = 0; i < tiles.length; i++) {
				buttonsContent += tiles[i].getHTML();
			}
			if(addButton) {
				addButtonContent += ('<button type="button" class="btn btn-default square-btn-right btn-add-player pull-right">' +
				'</button>');
			}
			var $playerRow = jQuery('<div class="player col-xs-12 col-sm-12 col-md-12" style="display: none">' +
				'<div class="row">' +
					'<div class="col-xs-12 col-sm-5 col-md-5">' +
							'<label class="labelSize" for="player-input-' + uniqNumber + '">Player ' + numbers[tiles.length - 1] + ':</label>' +
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
		};
		g.reinitPlayerTiles = function(tiles){
			console.log('reinitting');
			console.log(tiles);
			g2moku.$gameModal.find('.game-mode.player-vs-player').children().each(function(i, e){
				var buttonsNum = jQuery(this).parent().children().length,
					newButtons = '';
				for(var k = 0; k < tiles.length; k++) {
					console.log();
					if(tiles[k].selected) {
						if(tiles[k].$player.index() == i) {
							tiles[k].setClass('player-tile-selected');
						} else {
							tiles[k].setClass('player-tile-disabled');
						}
					}
					newButtons += tiles[k].getHTML();
				}
				jQuery(this).find('.left-buttons').html(newButtons);			
			});
		};
		g.gameStart = function(gameMode, data){
			switch (gameMode) {
				case 'playerVSplayer':
					g.gameStarted = true;
					g.players.parseFromGameModal(data);
					//add player box for each playing player.
					g.players.playing.each(function(e, i){
						g2moku.preparePlayerBlock(e, i);				
					});
					g.$gameTopBar.find('.game-play-text').html("<span='game-next-player'>Player</span> be ready for the game YOU ARE FIRST!<br/><b>Click to start the game!</b>");
					g.$gameTopBar.removeClass('invisible').addClass('fadeInDown animated');
					setInterval(function(){
						g.$gameTopBar.find('b').removeClass().addClass('tada animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
							jQuery(this).removeClass();
						});
					}, 4000);
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

		};	
		return g;
	}(g2moku || {}));	
	return g2moku;
});