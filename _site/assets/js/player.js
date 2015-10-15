function isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}
var Player = Class.create();
Player.prototype = {
	initialize: function(name) {
		this.moving = false;
		this.playingTile = false;
		this.moves = [];
		if(isObject(name)) {
			this.name = name.name;
			this.playingTile = new Phaser.Tile(g2moku.layer, name.playingTileIndex);
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
	startMove: function(tile){
		this.moving = true;
	},
	endMove: function(tile){
		this.moving = false;
		g2moku.players.willPlay(this);
	},
	moveToTile: function(tile) {
		//this.startMoving(tile);
		var g = g2moku,
			p = this;
		this.startMove(tile);
		this.moves.push(tile);
		if(this.playingTile === false) this.playingTile = new Phaser.Tile(g2moku.layer, 15);
		g.map.putTile(p.playingTile, g.layer.getTileX(g.marker.x), g.layer.getTileY(g.marker.y));
		//callback('asas');
		this.endMove(tile);
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