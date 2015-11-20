define(['prototype', 'utils', 'PlayerMove'], function(proto, utils, PlayerMove){
    //require('prototype'); // Ensure Prototype is present
	
    return Class.create({
		initialize: function(o) {
			this.moving = false;
			this.playingTile = false;
			this.moves = [];
			this.timer = false;
			this.layer = 0;
			this.name = 'Player';
			if(o) {
				if(utils.isObject(o)) {
					this.layer = o.layer || this.layer;
					if(o.playingTile) this.playingTile = o.playingTile;
					this.name = o.name;
					this.tile = o.tile;
				} else {
					this.name = o;
				}
			}
		},
		endMove: function(tile, callback){
			this.timer.clear();
			var playerMove = new PlayerMove({
				tile: tile, 
				timer: this.timer
			});
			this.moves.push(playerMove);
			//g2moku.history.push(playerMove);		
			this.moving = false;
			console.log('moving = false');
			callback(playerMove);
			this.afterEndMove(playerMove);
			//g2moku.players.willPlay(this);
		},
		startMove: function(tile){
			this.moving = true;
			this.afterStartMove(tile);
		},
		getJSON: function(){
			var p = this;
			var json = function(j){
				j.moving = p.moving;
				j.name = p.name;
				j.layer = p.layer;
				if(p.timer) j.timer = p.timer.getTimestampDiff();
				j.playingTile = {
					index: p.playingTile.index,
					wordlX: p.playingTile.worldX,
					worldY: p.playingTile.worldY,
					x: p.playingTile.x,
					y: p.playingTile.y
				};
				return j;
			}(json || {});
			return json;
		},
		afterEndMove: function(playerMove) {},
		afterStartMove: function() {},
		setPlayingTile: function(tile){
			console.log('setPlayingTile');
			if(utils.isObject(tile)) {
				//g.map.getTile(0, 0);
				this.playingTile = tile;
			} else {//if number 
				//this.playingTile = g.map.getImageIndex(index);
			}
		},
	})
});