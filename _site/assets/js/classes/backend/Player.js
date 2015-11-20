define(['AbstractPlayer', 'prototype', 'Timer'], function(AbstractPlayer, proto, Timer){
	var p = Class.create();
	// inherit from Person class:
	p.prototype = Object.extend(new AbstractPlayer(), {
		moveToTile: function(tile, layer, callback) {
			//this.moves.push(tile);
			//if(tile) this.playingTile = new Phaser.Tile(layer, 15);
			//callback('asas');
			this.endMove(tile, callback);
		},
		startTimer: function(){
			var p = this;
			this.startMove();
			this.timer = new Timer(1000, function(tim){
/*				var numbers = (new Date((tim.count * 1000))).toISOString().match(/(\d{2}:\d{2}:\d{2})/);
				p.$box.find('.time-elapsed').text(numbers[0]);*/
			});
		}
	}); 
	return p;
});