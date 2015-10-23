define(function(require){
    require('prototype'); // Ensure Prototype is present
	
    return Class.create({
		initialize: function(o) {
			this.moving = false;
			this.playingTile = false;
			this.moves = [];
			this.timer = false;
			this.layer = 0;
			this.name = 'Player';
			if(o) {
				if(isObject(o)) {
					this.layer = o.layer || this.layer;
					this.name = o.name;
					this.tile = o.tile;
					this.playingTile = new Phaser.Tile(this.layer, o.playingTileIndex);
				} else {
					this.name = o;
				}
			}
		},
		setPlayingTile: function(index){
			var g = g2moku;
			if(isObject(index)) {
				//g.map.getTile(0, 0);
			} else {//if number 
				//g.playingTile = g.map.getImageIndex(index);
			}
		},
		startTimer: function(){
			var p = this;
			this.startMove();
			this.timer = new Timer(1000, function(tim){
				var numbers = (new Date((tim.count * 1000))).toISOString().match(/(\d{2}:\d{2}:\d{2})/);
				p.$box.find('.time-elapsed').text(numbers[0]);
			});
		},
		startMove: function(tile){
			this.moving = true;
			this.$box.addClass('active');
		},
		endMove: function(tile){
			this.$box.removeClass('active');
			this.timer.clear();
			
			this.moving = false;
			//g2moku.players.willPlay(this);
		},
		moveToTile: function(tile) {
			//this.startMoving(tile);
			var g = g2moku,
				p = this;
			this.moves.push(tile);
			if(this.playingTile === false) this.playingTile = new Phaser.Tile(g2moku.layer, 15);
			g.map.putTile(p.playingTile, g.layer.getTileX(g.marker.x), g.layer.getTileY(g.marker.y));
			//callback('asas');
			this.endMove(tile);
		}
	})
});