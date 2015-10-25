define(['chai', 'player'], function(chai, Player) {
	var assert = chai.assert;
	describe("Player", function() { 
		describe("constructor", function() {
			it("should set player's name, passing string as argument", function() {
				var player = new Player("Name");
				assert.typeOf(player.name, 'string');
				assert.equal("Name", player.name);
			}); 
			it("should have a default name", function() {
				var player = new Player();
				assert.equal("Player", player.name);
			});
		}); 
	});
});