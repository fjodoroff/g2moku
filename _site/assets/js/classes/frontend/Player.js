define(['require', 'G2moku', 'AbstractPlayer', 'Timer'], function(require, g2moku, AbstractPlayer, Timer){
    require('prototype'); // Ensure Prototype is present
	var p = Class.create();
	// inherit from Person class:
	p.prototype = Object.extend(new AbstractPlayer(), {
		//playingTile: new Phaser.Tile(this.layer, o.playingTileIndex),
		// setPlayingTile: function(index){
			// var g = g2moku;
			// if(isObject(index)) {
				// //g.map.getTile(0, 0);
			// } else {//if number 
				// //g.playingTile = g.map.getImageIndex(index);
			// }
		// },
		startTimer: function(){
			var p = this;
			this.startMove();
			this.timer = new Timer(1000, function(tim){
				var numbers = (new Date((tim.count * 1000))).toISOString().match(/(\d{2}:\d{2}:\d{2})/);
				p.$box.find('.time-elapsed').text(numbers[0]);
			});
		},
		afterStartMove: function(tile){
			this.$box.addClass('active');
		},
		afterEndMove: function(playerMove){
			//this.$box.removeClass('active');
		},
		moveToTile: function(tile, layer, callback) {
			//this.moves.push(tile);
			if(this.playingTile === false) this.playingTile = new Phaser.Tile(layer, 15);
			//callback('asas');
			this.endMove(tile, callback);
		}
	});
    return p;
});