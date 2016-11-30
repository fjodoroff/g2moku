define(['require', 'G2moku', 'AbstractPlayerMove'], function(require, g2moku, AbstractPlayerMove){
    require('prototype'); // Ensure Prototype is present
	var p = Class.create();
	// inherit from Person class:
	p.prototype = Object.extend(new AbstractPlayerMove(), {
		//playingTile: new Phaser.Tile(this.layer, o.playingTileIndex),
	});
    return p;
});