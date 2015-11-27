define(['AbstractG2moku', 'prototype', 'socket.io', 'Player', 'Timer', 'Game', 'utils'], function(AbstractG2moku, proto, io, Player, Timer, Game, utils){
	var g2 = (function(g) {
		g.io = io.connect('http://localhost:' + location.port, {
			'force new connection': true
		});
		g.game = new Phaser.Game('100%', '100%', Phaser.AUTO);
		g.$playerBoxes = jQuery('.player-boxes');
		g.$gameTopBar = jQuery('.game-topbar');
		g.$gameModal = jQuery('#game-modal');
		g.$gameRules = jQuery('#game-rules');
		g.$gameStatistics = jQuery('#game-statistics');
		g.$box = null;
		g.firstTime = true;
		g.marker = null;
		g.offline = false;
		g.cursors = null;
		g.currentTile = null;
		g.sprites = null;
		g.canUpdateMarker = true;
		g.onSendGameStats = function(data){
			if(!g.games.inited) {
				g.games.initGames(data.games);
			} else {
				g.games.updateGames(data.games);
			}
		};
		g.games = {
			games: {},
			inited: false,
			$activeGames: null,
			checkDataToUpdate: function(games){
				var keys = Object.keys(games),
					data = {};
				for(var i = 0; i < keys.length; i++) {
					var k = keys[i],
						e = games[k];
					console.log('checking');
					console.log(games);
					if(this.games[k] === undefined) data[k] = true;
					else {
						data[k] = utils.deepDiffMapper.map([
							games[k].gameID,
							games[k].players[0].name,
							games[k].players[1].name,
							games[k].gameMode,
							games[k].status,
							games[k].movingPlayer
						], [
							this.games[k].gameID,
							this.games[k].players[0].name,
							this.games[k].players[1].name,
							this.games[k].gameMode,
							this.games[k].status,
							this.games[k].movingPlayer
						]);
						console.log(data[k]);
					}
				}
				return data;
			},
			initGames: function(games){
				console.log('initGames');
				console.log(games);
				this.$activeGames = g.$gameStatistics.find('.active-games tbody');
				this.$activeGames.empty();

				var keys = Object.keys(games);
				for(var i = 0; i < keys.length; i++) {
					var key = keys[i],
						e = games[key];
					var game = new Game(e);
					this.games[key] = game;
					this.$activeGames.append(game.toTableHTML());
				}
				this.inited = true;
			},
			addGame: function(gameData){
				var game = new Game(gameData);
				this.games[game.gameID] = game;
				this.$activeGames.append(game.toTableHTML());
			},
			updateGames: function(games, callback){
				var dataToUpdate = this.checkDataToUpdate(games),
					keys = Object.keys(dataToUpdate);
				if(keys.length > 0) {
					for (var i = 0; i < keys.length; i++) {
						var k = keys[i],
							e = dataToUpdate[k],
							$addingTR = g.$gameStatistics.find('.realtime-stats-game-gameID-' + utils.getFormatedGameID(games[k].gameID));
						console.log('block with this id?' + games[k].gameID);
						console.log($addingTR.length);
						//if($addingTR.length == 0) {
							if (e === true) {
								this.addGame(games[k]);
							}
							if(utils.isObject(e)) {
								console.log('isObject');
								this.updateGame(this.games[k], e, function(){

								});
							}
						//} else {
						//}
					}
				}
			},
			updateGame: function(game, dataToUpdate, callback){
				var $game = g.$gameStatistics.find('.realtime-stats-game-gameID-' + game.getFormatedGameID());
				console.log('updateGame');
				console.log(dataToUpdate);
				console.log($game.length);
				var keys = Object.keys(dataToUpdate);
				if($game.length > 0 && keys.length > 0) {
					for(var i = 0; i < keys.length; i++) {
						var k = keys[i],
							e = dataToUpdate[k];
						console.log(e);
						if(e.type == 'updated' || e.code) {
							var $changingTD = $game.children().eq(k),
								changedData = e.data ? e.data : false;
							if(e.data && e.data.name) {
								changedData = e.data.name;
							}
							if(e.code) {
								changedData = e.msg.data;
								if(e.code.type == 'updated') {
									$changingTD.removeClass('bg-warning bg-success');
									if (e.code.data == "0") $changingTD.addClass('bg-warning');
									else if (e.code.data == "1") $changingTD.addClass('bg-success');
									else {

									}
								}
							}
							$changingTD.html(changedData);
						}
					}
				}
			}
		};
		g.setMarker = function(marker) {
			g.marker.x = marker[0];
			g.marker.y = marker[1];
		};
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
				console.log(g.gameStarted + " " + g.playerMoving);
				if(g.gameStarted && !g.playerMoving) { // IF Game started
					try {
						console.log('clicked');
						g.playerMoving = true;
						if(g.players.currentPlaying === false) {//first turn
							//GameStart
							g.io.emit('startGame', {
								timeStamp: +new Date(),
								gameID: g.getGameID(),
								players: g.players.getPlaying()
							});
							if(g.offline) {
								g.generateID(g.generateID(function(preGenerated, genID){
									g.genID = preGenerated + "." + genID
								}));//generating gameID.(getGameID())
								g.singleStartGame();
							}
						} else {
							g.gameState.getTileProperties();
							var tileX = g.layer.getTileX(g.marker.x),
								tileY = g.layer.getTileY(g.marker.y),
								tile = g.map.getTile(tileX, tileY);
							console.log('gameMODE');
							console.log(g.gameMode);
							if(!g.offline && g.gameMode !== 'playerVSplayer') {
								g.io.emit('beforeMoveToTile', {
									gameID: g.getGameID(),
									player: g.players.currentPlaying.getJSON(),
									gameTimer: g.timer,
									tile: {
										x: tileX,
										y: tileY
									},
									timeStamp: +new Date()
								});
							}
							if(g.offline || g.gameMode === 'playerVSplayer') {
								console.log('singleMove');
								//console.log([tileX, tileY]);
								g.singleMoveToTile({
									x: tileX,
									y: tileY
								}, function(win, PlayerMove){
									g.io.emit('moveToTile', {//only sending data to server gameID: g.gameID,
										player: g.players.currentPlaying.getJSON(),
										gameID: g.getGameID(),
										gameTimer: g.timer,
										tile: {
											x: tileX,
											y: tileY
										},
										timeStamp: +new Date()
									});
									if(!win) {
										g.players.willPlay(g.players.currentPlaying);
										g.players.currentPlaying.$box.removeClass('active');
										g.players.next(g.gameStarted);//take next player in queue
										g.$gameTopBar.find('.game-play-text').html("<span class='game-next-player'>" + g.players.currentPlaying.name + "</span>'s turn!");
										g.players.currentPlaying.$box.addClass('active');
										g.players.currentPlaying.startTimer();
									}
									g.playerMoving = false;
								});
							}
						}
					} catch(e) {
						throw e;
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
		g.singleMoveToTile = function(tile, callback){
			var tile = g.map.getTile(tile.x, tile.y);
			console.log(tile);
			console.log('above-tile');
			g.players.currentPlaying.moveToTile(tile, g.layer, function(playerMove){
				playerMove.player = g.players.currentPlaying;
				playerMove.id = g.history.getNextID();
				console.log('move to tile');
				console.log(playerMove);
				//Put tile on map

				g.map.putTile(g.players.currentPlaying.playingTile, tile.x, tile.y);
				g.step(playerMove.tile.x, playerMove.tile.y, playerMove.player, function(win, turn) {
					console.log('win-turn callback');
					g.addHistory(playerMove);
					if(win) {
						g.gameEnd(g.players.currentPlaying, function(timer){
							console.log('ENDED');
							g.playerMoving = false;
						});
					} else {

					}
					g.addDataToPlayerBlock(playerMove, function(newPlayerMove){
						callback(win, newPlayerMove); //callback after checking, putting to tilemap, adding to player block
						console.log(g);
					});
					// Она нам вернёт значения ходе, если победитель, а так же чем ходили всё передадим как есть в событие пользователям
				});
				//g.players.currentPlaying.moveToTile
			});
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
			var $playerMove = jQuery('<tr class="player-turn invisible' + (g.offline ? " not-sended" : "") + '">' +
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
				jQuery(this).removeClass(anim + ' animated');
				//playerMove.player.$box.find('.bottom-block').height(300);
				//playerMove.player.$box.find(".nano").nanoScroller();
				callback(playerMove);
			});
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
		g.singleStartGame = function(){
			g.players.next(g.gameStarted);
			console.log(g.players);
			g.$gameTopBar.find('.game-play-text').html("<span class='game-next-player'>" + g.players.currentPlaying.name + "</span>'s turn!");
			g.players.currentPlaying.startTimer();
			g.playerMoving = false;
		};
		g.singleGameStart = function(){
			g.$gameTopBar.find('.game-play-text').html("<span='game-next-player'>Player</span> be ready for the game YOU ARE FIRST!<br/><b>Click to start the game!</b>");
			//add player box for each playing player.
			g.players.playing.each(function(e, i){
				g.preparePlayerBlock(e, i);
			});
			g.$gameTopBar.find('.game-play-text').removeClass('invisible');
			g.$gameTopBar.removeClass('invisible').addClass('fadeInDown animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				jQuery(this).removeClass('fadeInDown animated');
			});
			setInterval(function(){
				g.$gameTopBar.find('b').removeClass().addClass('tada animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					jQuery(this).removeClass();
				});
			}, 4000);
		};
		g.gameStart = function(gameMode, data){
			console.log('not firsttime');
			console.log(g);
			if(!g.firstTime) {
				g.game.state.start('GameState', true, false);
				//g.game.state.add('GameState', g.gameState, true);
				console.log(g);
			}
			g.gameMode = gameMode;
			switch (gameMode) {
				case 'playerVSplayer':
					g.gameStarted = true;
					g.playerMoving = false;
					g.canUpdateMarker = true;
					g.timer = new Timer(1000, function(timer){

					});
					g.players.parseFromGameModal(data);
					g.io.emit('playGame', {
						timeStamp: +new Date(),
						gameMode: gameMode,
						players: g.players.getPlaying()
					});
					if(g.offline) g.singleGameStart();
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
		g.finalEndGame = function(){ //resetting all arrays and objects. preparing for new game.
			jQuery('body').removeClass('win');
			g.$gameTopBar.find('.game-play-text').addClass('invisible');
			if(g.winningTimerID) clearInterval(g.winningTimerID);
			g.winningTimerID = false;
			g.players.clear();
			g.players.currentPlaying = false;
			//g.history = [];
			g.board = [];
			g.firstTime = false;
			g.gameStarted = false;
			console.log('finalendgame');
			console.log(g.players);
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
			g.io.on('beforeMoveToTile', function(data) {
				if(data && data.canMove) {
					g.singleMoveToTile(data.tile, function(win, PlayerMove){
						g.players.willPlay(g.players.currentPlaying);
						g.players.currentPlaying.$box.removeClass('active');
						g.players.next(g.gameStarted);//take next player in queue
						g.$gameTopBar.find('.game-play-text').html("<span class='game-next-player'>" + g.players.currentPlaying.name + "</span>'s turn!");
						g.players.currentPlaying.$box.addClass('active');
						g.players.currentPlaying.startTimer();
						g.playerMoving = false;
					});
				}
			});
			g.io.on('sendGamesStats', function(data) {
				g.onSendGameStats(data);
			});
			g.io.on('startGame', function(data) {
				if(data && data.can) {
					if(data.gameID) {
						console.log('startGame');
						g.gameID = data.gameID;
						g.singleStartGame();
					} else {
					}
				}
			});
			g.io.on('playGame', function(data) {
				if(data && data.can) {
					if(data.gameID) {
						g.gameID = data.gameID;
						g.genID = data.genID;
						console.log(g.gameID);
						g.singleGameStart();
					} else {
						g.genID = g.generateID(function(preGenerated, genID){
							g.genID = preGenerated + "." + genID;
							g.singleGameStart();
						});
					}
				}
			});
			// Listen for the talk event.
			g.io.on('connect_failed', function(data){
				console.log('connect_failed');
			});
			g.io.on('connecting', function(data){
				console.log('connecting');
				g.$gameModal.find('.logo .short-message').html('<i class="fa fa-circle bg-yellow"></i> Connecting...');
			});
			g.io.on('disconnect', function(data){
				g.offline = true;
				g.$gameModal.find('.logo .short-message').html('<i class="fa fa-circle"></i> Disconnect');
				jQuery('body').removeClass('online').addClass('offline');
				console.log('disconnect');
			});
			g.io.on('error', function(reason){
				console.log('error');
			});
			g.io.on('reconnect_failed', function(data){
				g.$gameModal.find('.logo .short-message').html('<i class="fa fa-circle"></i> Reconnect failed');
				console.log('reconnect_failed');
			});
			g.io.on('reconnect', function(data){
				g.offline = false;
				g.$gameModal.find('.logo .short-message').html('<i class="fa fa-circle"></i> Reconnected');
				g.onSendGameStats();
				jQuery('body').removeClass('offline').addClass('online');
				setTimeout(function(){
					g.$gameModal.find('.logo .short-message').html('<i class="fa fa-circle"></i> Realtime');
				}, 2000);
				console.log('reconnect');
			});
			g.io.on('reconnecting', function(data){
				g.$gameModal.find('.logo .short-message').html('<i class="fa fa-circle bg-yellow"></i> Reconnecting...');
				console.log('reconnecting');
			});
			//g.io.on('log', function(data) {
			//	console.log(data);
			//});
			g.io.on('welcome', function(data) {
				console.log(data);
				if(g.$gameModal.find('.logo .short-message').length == 0) g.$gameModal.find('.logo').append('<div class="short-message"><i class="fa fa-circle"></i> ' + data.message + '</div>');
				else {
					g.$gameModal.find('.logo .short-message').html('<i class="fa fa-circle"></i> Realtime');
					jQuery('body').removeClass('offline').addClass('online');
					g.offline = false;
				}
				jQuery('body').addClass('online');
			});
			jQuery('body').on('click', '.player-turn-xy', function(e){
				g.canUpdateMarker = false;
				var $this = jQuery(this);
				$this.parent().addClass('bg-primary');
				g.marker.lineStyle(2, 0x000000, 1);
				console.log(g);
				console.log('g2moku');
				g.setMarker([g.layer.getTileX($this.data('x')) * 32, g.layer.getTileY($this.data('y')) * 32]);
				setTimeout(function(){
					g.canUpdateMarker = true;
					$this.parent().removeClass('bg-primary');
				}, 3000);
				console.log(g.marker);
				// setTimeout(function(){
					// g2moku.canUpdateMarker = false;
				// }, 2000);
			});
			jQuery('body').on('click', '.play-more', function(e){
				g.finalEndGame();
				g.$gameModal.modal('show');
				e.preventDefault();
			});
		};
		return g;
	}(new AbstractG2moku() || {}));
	return Class.create(AbstractG2moku, g2);
});