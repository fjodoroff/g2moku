var g2moku = {
	debug: true,
	$gameModal: null,
	game: new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO),
	map: null,
	layer: null,
	cursors: null,
	marker: null,
	currentTile: null,
	sprites: null,
	canvas: null,
	gameStarted: false,
	players: {
		arr: [],
		playing: null,
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
			if(this.playing == null && g2moku.gameStarted) this.playing = this.arr;
			return this.playing !== null && g2moku.gameStarted ? this.playing.pop() : false;
		},
		parseFromGameModal: function(){
			this.arr.push(new Player({
				name: 'Player1',
				playingTileIndex: 45
			}));
			this.arr.push(new Player({
				name: 'Player2',
				playingTileIndex: 23
			}));			
			this.arr.push(new Player({
				name: 'Player3',
				playingTileIndex: 40
			}));
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
			if(g.gameStarted && g.players.getLast() !== false) g.game.debug.text('Player move' + g.players.getLast().name, 300, 300);
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
			if(g.gameStarted) {
				g.gameState.getTileProperties();
				var player = g.players.next();
				if(typeof player !== "undefined") {
					var tile = g.map.getTile(g.layer.getTileX(g.marker.x), g.layer.getTileY(g.marker.y));
					player.moveToTile(tile);
				}
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
	gameStart: function(gameMode){
		var g = this;
		switch (gameMode) {
			case 'playerVSplayer':
				g.gameStarted = true;
				g.players.parseFromGameModal();
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

g2moku.game.state.add('GameState', g2moku.gameState);
g2moku.game.state.start('GameState');
jQuery(document).ready(function(){
	g2moku.$gameModal = jQuery('#game-modal');
	g2moku.$gameModal.modal({
		backdrop: 'static'
	});
	jQuery('.play-btn').on('click', function(e){
		g2moku.$gameModal.modal('hide');
		g2moku.gameStart('playerVSplayer');
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
	});
});