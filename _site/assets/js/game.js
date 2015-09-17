var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO);
var GameState = {
	preload: function(){
		var map;
		var layer;
		var marker;
		// var sprite;
		var cursors;
		var currentTile;
		//game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
		game.load.tilemap('map', 'assets/maps/board.csv', null, Phaser.Tilemap.CSV);
		game.load.image('tiles', 'assets/tiles/gridtiles.png');
	},
	create: function(){
		game.physics.startSystem(Phaser.Physics.ARCADE);

		map = game.add.tilemap('map', 32, 32);

		map.addTilesetImage('tiles');
		currentTile = map.getTile(0, 0);
		
		//map.setCollisionBetween(1, 12);

		layer = map.createLayer(0);

		layer.resizeWorld();

		//  Our painting marker
		marker = game.add.graphics();
		marker.lineStyle(2, 0xffffff, 1);
		marker.drawRect(0, 0, 32, 32);

		game.input.addMoveCallback(this.updateMarker, this);

		game.input.onDown.add(this.getTileProperties, this);

		cursors = game.input.keyboard.createCursorKeys();
	},
	update: function(){
		marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
		marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;
		if (cursors.left.isDown)
		{
			game.camera.x -= 4;
		}
		else if (cursors.right.isDown)
		{
			game.camera.x += 4;
		}

		if (cursors.up.isDown)
		{
			game.camera.y -= 4;
		}
		else if (cursors.down.isDown)
		{
			game.camera.y += 4;
		}
	},
	getTileProperties: function(){

		var x = layer.getTileX(game.input.activePointer.worldX);
		var y = layer.getTileY(game.input.activePointer.worldY);

		var tile = map.getTile(x, y, layer);

		tile.properties.wibble = true;
		map.putTile(currentTile, layer.getTileX(marker.x), layer.getTileY(marker.y))
		
	},
	updateMarker: function() {
		marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
		marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;			
	}
};
game.state.add('GameState', GameState);
game.state.start('GameState');