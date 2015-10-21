function isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}
var Player = Class.create();
Player.prototype = {
	initialize: function(o) {
		this.moving = false;
		this.playingTile = false;
		this.moves = [];
		this.timer = false;
		if(isObject(o)) {
			this.name = o.name;
			this.tile = o.tile;
			this.playingTile = new Phaser.Tile(g2moku.layer, o.playingTileIndex);
		} else {
			this.name = name;
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
};
function Timer(interval, callback) {
	this.count = 0;
	this.callback = callback;
	this.interval = interval;
	this.startTimestamp = 0;
	t = this;
	this.clear = function() {
		clearInterval(this.id);
	};
	this.initialize();
	return this;
}
Timer.prototype = {
	initialize: function() {
		this.startTimestamp = +new Date();
		this.id = setInterval(function(){
			t.count++;
			t.callback(t);
		}, this.interval);
	}
};
var PlayerBot = Class.create();
// inherit from Person class:
PlayerBot.prototype = Object.extend(new Player(), {
	// redefine the speak method
	say: function(message) {
		return this.name + ': ' + message + ', yarr!';
	}
});   
// var guy = new Person('Miro');
// guy.say('hi');
// -> "Miro: hi" 
// var john = new PlayerBot('Long John');
// john.say('ahoy matey');