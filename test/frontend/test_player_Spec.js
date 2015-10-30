define(['chai', 'player', 'gameTile', 'phaser'], function(chai, Player, GameTile, Phaser) {
	var assert = chai.assert,
		expect = chai.expect;
	describe("Player", function() {	
		describe("constructor", function() {
			it("should set player's name, passing string as argument", function() {
				var player = new Player("Name");
				
				expect(player.name).to.be.a('string').and.equal("Name");
			});
			it("should have a correct default properties", function() {
				var player = new Player();
				
				expect(player.moving).to.be.false;
				expect(player.playingTile).to.be.false;
				expect(player.timer).to.be.false;
				expect(player.layer).equal(0);
				expect(player.moves).to.be.instanceof(Array).and.empty;	
				expect(player.name).to.be.a('string').and.equal("Player");

			});
			it("should set player's properties, passing object as argument (without layer property)", function() {
				var object = {
						name: "Maksim",
						tile: new GameTile('key', {
							index: 5,
							imgPath: ' ' 
						}),
						playingTileIndex: 2
					}, player = new Player(object);
					
				expect(player.name).to.be.a('string').and.equal(object.name);
				expect(player.tile).to.be.an.instanceof(GameTile);
				expect(player.playingTile).to.be.an.instanceof(Phaser.Tile);
			});
		}); 
	});
});