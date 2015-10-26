define(['require', 'G2moku'], function(require, g2moku){
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
				} else {
					this.name = o;
				}
			}
		},
		endMove: function(tile){
			this.timer.clear();	
			this.moving = false;
			this.afterEndMove(tile);
			//g2moku.players.willPlay(this);
		},
		startMove: function(tile){
			this.moving = true;
			this.afterStartMove(tile);
		},
		afterEndMove: function() {},
		afterStartMove: function() {},
		setPlayingTile: function(index){
			var g = g2moku;
			if(isObject(index)) {
				//g.map.getTile(0, 0);
			} else {//if number 
				//g.playingTile = g.map.getImageIndex(index);
			}
		}
	})
});