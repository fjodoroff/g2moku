define(['AbstractG2moku', 'prototype', 'socket.io', 'Player', 'Timer'], function(AbstractG2moku, proto, io, Player, Timer){
	var g2 = (function(g) {
		g.io = io.connect('http://localhost:' + location.port);
		g.game = new Phaser.Game('100%', '100%', Phaser.AUTO);
		g.$playerBoxes = jQuery('.player-boxes');
		g.$gameTopBar = jQuery('.game-topbar');
		g.$gameModal = jQuery('#game-modal');
		g.$gameRules = jQuery('#game-rules');
		g.$gameStatistics = jQuery('#game-statistics');
		g.gameState = {
			init: function(a, b){
				g2moku = a;
				g2moku = b;
				console.log(a);
				console.log(b);
			},
			preload: function(){
				//game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
				g.game.load.tilemap('map', 'assets/maps/board.csv', null, Phaser.Tilemap.CSV);
				g.game.load.image('tiles', 'assets/tiles/gridtiles.png');
				//game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);
				//game.load.spritesheet('citizenmale', 'assets/sprites/citizenmale.png', 64, 64, 10);
			},
			create: function(){
				console.log(g2moku);
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
				//game.time.events.loop(1050, this.createSprite, this)

				g.cursors = g.game.input.keyboard.createCursorKeys();
				
				//g.sprite = g.game.add.sprite(40, 100, 'ms');
				console.log(g.map.width);
						
				g.game.input.addMoveCallback(this.updateMarker, this);
				g.game.input.onDown.add(this.clickHandler, this);
				
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
					g.game.debug.cameraInfo(g.game.camera, 32, 432);
					g.game.debug.inputInfo(32, 530);
					//g.game.debug.spriteInputInfo(g.sprite, 32, 130);
					g.game.debug.pointer(g.game.input.activePointer );
				}
			},
			update: function(){
				if(g.canUpdateMarker) {
					g.marker.x = g.layer.getTileX(g.game.input.activePointer.worldX) * 32;
					g.marker.y = g.layer.getTileY(g.game.input.activePointer.worldY) * 32;				
				}
				
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
			clickHandler: function(pointer, event){
				if(g.gameStarted && !g.playerMoving) { // IF Game started
					try {
						g.playerMoving = true;
						console.log('clicked');
						if(g.players.currentPlaying === false) {//first turn
							//GameStart
							g.io.emit('startGame', {
								timeStamp: +new Date()
							});
							if(g.gameStarted) g.players.next();
							console.log(g.players);
							g.$gameTopBar.find('.game-play-text').html("<span class='game-next-player'>" + g.players.currentPlaying.name + "</span>'s turn!");
							g.players.currentPlaying.startTimer();
							g.playerMoving = false;
						} else {
							g.gameState.getTileProperties();
							var tile = g.map.getTile(g.layer.getTileX(g.marker.x), g.layer.getTileY(g.marker.y));
							g.players.currentPlaying.moveToTile(tile, g.layer, function(playerMove){
								playerMove.player = g.players.currentPlaying;
								playerMove.id = g.history.length;
								console.log('move to tile');
								console.log(playerMove);
								//Put tile on map
								g.map.putTile(g.players.currentPlaying.playingTile, g.layer.getTileX(g.marker.x), g.layer.getTileY(g.marker.y));
								g.step(playerMove.tile.x, playerMove.tile.y, playerMove.player, function(win, turn) {
									console.log('win-turn callback');
									g.history.push(playerMove);
									g.addDataToPlayerBlock(playerMove, function(){
										g.players.currentPlaying.$box.removeClass('active');
										if(g.gameStarted) g.players.next();//take next player in queue
										g.players.currentPlaying.$box.addClass('active');
										if(!win) g.$gameTopBar.find('.game-play-text').html("<span class='game-next-player'>" + g.players.currentPlaying.name + "</span>'s turn!");
										g.players.currentPlaying.startTimer();
										g.playerMoving = false;
										console.log(g);	
									});
									if(win) {
										g.gameEnd(g.players.currentPlaying, function(timer){
											console.log('ENDED');
										});
									} else {
									
									}
									g.players.willPlay(g.players.currentPlaying);
									// Она нам вернёт значения ходе, если победитель, а так же чем ходили всё передадим как есть в событие пользователям
								});
								//g.players.currentPlaying.moveToTile
							});	
						}
					} catch(e) {
						
					}
				}
			},
			updateMarker: function() {
				if(g.canUpdateMarker) {
					g.marker.x = g.layer.getTileX(g.game.input.activePointer.worldX) * 32;
					g.marker.y = g.layer.getTileY(g.game.input.activePointer.worldY) * 32;
				}
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
		g.makeGameMenuPlayerRow = function(tiles, addButton) {
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
							'<input type="text" class="form-control input-player-name" id="player-input-' + uniqNumber + '" placeholder="Player name..." value="Player-' +  (g.debug ? (uniqNumber + "").substr(-4) : "") + '">' +
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
			g.$gameModal.find('.game-mode.player-vs-player').append($playerRow);
			$playerRow.slideDown(300);			
		};
		g.addDataToPlayerBlock = function(playerMove, callback){
			console.log(playerMove);
			// playerMove.moves.each(function(e, i){
				// console.log('start');
				// console.log(e);
				// console.log(i);
			var $playerMove = jQuery('<tr class="player-turn invisible">' +
				'<th scope="row">' + playerMove.id + '</th>' +
				'<td>' + playerMove.timer.getTimestampDiff(true) + '</td>' + 
				'<td class="player-turn-xy" data-x="' + playerMove.tile.worldX + '" data-y="' + playerMove.tile.worldY + '">' +
				'<span class="player-turn-x">x ' + playerMove.tile.x + '</span>' +
				'<span class="player-turn-y">y ' + playerMove.tile.y + '</span>' +
			'</tr>'),
			anim = playerMove.player.$box.hasClass('player-box-bottom-left') || playerMove.player.$box.hasClass('player-box-bottom-right') ? 'fadeInUp' : 'fadeInDown';
			//});
			playerMove.player.$box.find('.player-game-history tbody').prepend($playerMove);
			$playerMove.removeClass("invisible").addClass(anim + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				jQuery(this).removeClass();
				//playerMove.player.$box.find('.bottom-block').height(300);
				//playerMove.player.$box.find(".nano").nanoScroller();
				callback();
			});
			return $playerMove;
		};
		g.preparePlayerBlock = function(player, i){ //adding jquery player box, as a additional property
			var corners = [
				'player-box-top-left', 'player-box-top-right', 'player-box-bottom-left', 'player-box-bottom-right'
			], headers = '<tr><th>#</th><th>Time</th><th>Pos</th></tr>',
			theader = '', tfooter = '';
			if(i >=2) {
				tfooter = '<tfoot>' + headers + '</tfoot>';
			} else {
				theader = '<thead>' + headers + '</thead>';				
			}
			console.log(player);
			player.$box = jQuery('<div class="player-box ' + corners[i] + '" style="display: none;" title="' + player.name + '">' +
				'<div class="main-block">' +
					'<div class="avatar">' +
						'<span>' + player.name.substring(0, 3) + '.</span>' +
					'</div>' +
					'<div class="bottom-panel">' +
						'<span class="label label-primary time-elapsed">00:00:00</span>' +
					'</div>' +
					'<div class="playing-tile">' +
						'<img src="' + player.tile.imgPath + '">' +
					'</div>' +
				'</div>' +
				'<div class="bottom-block">' +
					'<table class="table table-bordered player-game-history">' + theader + 
						'<tbody>' +
						'</tbody>' + tfooter +
					'</table>' +						
				'</div>' +
			'</div>');
			jQuery('body').prepend(player.$box);
			player.$box.fadeIn(300);
		};
		g.reinitPlayerTiles = function(tiles){
			console.log('reinitting');
			console.log(tiles);
			g.$gameModal.find('.game-mode.player-vs-player').children().each(function(i, e){
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
			if(!g.firstTime) {
				g.game.state.start('GameState', true, false);
				//g.game.state.add('GameState', g.gameState, true);
				console.log(g);
			}
			switch (gameMode) {
				case 'playerVSplayer':
					g.gameStarted = true;
					g.playerMoving = false;
					g.canUpdateMarker = true;
					g.timer = new Timer(1000, function(timer){
						
					});
					g.players.parseFromGameModal(data);
					//add player box for each playing player.
					g.io.emit('playGame', g.players.getPlaying());
					g.players.playing.each(function(e, i){
						g.preparePlayerBlock(e, i);
					});
					g.$gameTopBar.find('.game-play-text').html("<span='game-next-player'>Player</span> be ready for the game YOU ARE FIRST!<br/><b>Click to start the game!</b>");
					g.$gameTopBar.find('.game-play-text').removeClass('invisible');
					g.$gameTopBar.removeClass('invisible').addClass('fadeInDown animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
						jQuery(this).removeClass('fadeInDown animated');
					});
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
		g.gameEnd = function(winnerPlayer, callback){
			jQuery('body').addClass('win');
			g.timer.clear();
			g.gameStarted = false;
			g.canUpdateMarker = false;
			g.$gameTopBar.addClass('invisible');
			var animate = function($obj, anim){
				$obj.removeClass('invisible').addClass(anim + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					jQuery(this).removeClass(anim + ' animated');
				});				
			};
			g.$gameTopBar.find('.game-play-text').html("<span class='game-win-player'>" + winnerPlayer.name + "</span> WIN!<br/><div class='brief-stats'>Time: <span>" + g.timer.getTimestampDiff(true) + "</span> | Moves: <span>" + winnerPlayer.moves.length + "</span></div><a href='#' class='btn btn-lg btn-primary play-more'>Wanna Play more?</a>");
			animate(g.$gameTopBar, 'tada');
			winnerPlayer.$box.addClass('winner');
			animate(winnerPlayer.$box, 'pulse');
			g.winningTimerID = setInterval(function(){
				animate(g.$gameTopBar, 'tada');
				animate(winnerPlayer.$box, 'pulse');
			}, 4000);
			g.playerMoving = false;		
			callback(g.timer);
		};
		g.finalEndGame = function(){
			jQuery('body').removeClass('win');
			g.$gameTopBar.find('.game-play-text').addClass('invisible');
			if(g.winningTimerID) clearInterval(g.winningTimerID);
			g.players.playing.each(function(e, i){
				e.$box.remove();
			});
			g.players.playing = [];
			g.history = [];
			g.players.arr = [];
			g.board = [];
			g.firstTime = false;
		};
		g.initHandlers = function(){
			console.log('inithandlers');
			g.io.emit('ready', {
				timeStamp: +new Date(),
				screenSize: {
					x: g.game.width,
					y: g.game.height
				}
			});
			g.mapHeight = g.game.height;
			g.mapWidth = g.game.width;
			// Listen for the talk event.
			g.io.on('log', function(data) {
				console.log(data);
			});
			g.io.on('welcome', function(data) {
				console.log(data);
				g.$gameModal.find('.logo').append('<div class="short-message"><i class="fa fa-circle"></i> ' + data.message + '</div>');
				jQuery('body').addClass('online');
			});
		};
		return g;
	}(new AbstractG2moku() || {})); 
	return Class.create(AbstractG2moku, g2);
});