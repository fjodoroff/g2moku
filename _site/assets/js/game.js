var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO),
	map;
var GameState = {
	preload: function(){
		var layer;
		var marker;
		// var sprite;
		var cursors;
		var currentTile;
		var sprites;
		var rip = 0;
		//game.load.image('ground_1x1', 'assets/tilemaps/tiles/ground_1x1.png');
		game.load.tilemap('map', 'assets/maps/board.csv', null, Phaser.Tilemap.CSV);
		game.load.image('tiles', 'assets/tiles/gridtiles.png');
		//game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);
		//game.load.spritesheet('citizenmale', 'assets/sprites/citizenmale.png', 64, 64, 10);
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

		sprites = game.add.group();
		//game.time.events.loop(1050, this.createSprite, this);
		
		game.input.addMoveCallback(this.updateMarker, this);

		game.input.onDown.add(this.getTileProperties, this);

		cursors = game.input.keyboard.createCursorKeys();
		
		sprite = game.add.sprite(40, 100, 'ms');
		console.log(map.width);
			    
    var canvas = window.document.getElementsByTagName('canvas')[0],
        prevX = 0, prevY = 0, mouseDown = false;
    
    canvas.addEventListener('touchstart',function(e){
    	prevX = e.changedTouches[0].screenX;
        prevY = e.changedTouches[0].screenY;
    });
    
    canvas.addEventListener('mousedown',function(e){
    	mouseDown = true;
    	prevX = e.screenX;
        prevY = e.screenY;
    });
    
    canvas.addEventListener('touchmove',function(e){
    	e.preventDefault();
    	game.camera.x+= prevX - e.changedTouches[0].screenX;
    	prevX = e.changedTouches[0].screenX;
        game.camera.y+= prevY - e.changedTouches[0].screenY;
        prevY = e.changedTouches[0].screenY;
    });
    
    canvas.addEventListener('mousemove',function(e){
    	if(mouseDown){
	    	e.preventDefault();
	    	game.camera.x+= prevX - e.screenX;
	    	prevX = e.screenX;
	        game.camera.y+= prevY - e.screenY;
	        prevY = e.screenY;
	    }
    });
    
    canvas.addEventListener('mouseup',function(e){
    	mouseDown = false;
    });
    
    canvas.addEventListener('mouseleave',function(e){
    	mouseDown = false;
    });

	},
	update: function(){
		marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
		marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;
		
		sprites.setAll('x', 1, true, true, 1);

		sprites.forEach(checkSprite, this, true);
		
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

		// var tile = map.getTile(x, y, layer);

		// tile.properties.wibble = true;
		map.putTile(currentTile, layer.getTileX(marker.x), layer.getTileY(marker.y))
		
	},
	updateMarker: function() {
		marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
		marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;
	}, 
	createSprite: function() {
		var mummy = sprites.create(0, game.world.randomY, 'mummy');
		mummy.scale.x = 2;
		mummy.scale.y = 2;
		var citizen = sprites.create(0, game.world.randomY, 'citizenmale');
		mummy.animations.add('walk');
		citizen.animations.add('walk', [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]);
		mummy.play('walk', 10, true);
		//citizen.play('walk', 10, true);
		game.add.tween(citizen).to({ x: game.width }, 5000, Phaser.Easing.Exponential.InOut, true);
	}
};

function checkSprite(sprite) {

    try {
        if (sprite.x > game.width)
        {
            rip++;
            sprites.remove(sprite, true);
        }
    }
    catch (e)
    {
        console.log(sprite);
    }

}

game.state.add('GameState', GameState);
game.state.start('GameState');
$(document).ready(function(){
	var $gameModal = $('#game-modal').modal({
		backdrop: 'static'
	});
	$('.play-btn').on('click', function(e){
		$gameModal.modal('hide');
		//map.setTileSize(20, 20);
		// map.replace(24, 46);
		// map.replace(12, 34);
		// setInterval(function(){
			// map.forEach(function(tile){
				// console.log(tile.x + "x" + tile.y);
				// map.putTile(3, tile.x, tile.y);
			// }, game, 0, 0, 10, 10);
		// });
		//map.removeAllLayers();
	});

});