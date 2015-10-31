define(['chai', 'Player', 'GameTile'], function(chai, Player, GameTile) {
	var expect = chai.expect;
	describe("GameTile test", function() {
		describe("Player methods",function(){
			it("passing object as argument", function() {
				var obj = {};		
				expect(isObject(obj)).to.be.true;
			});
			it("testing setPlayer method",function(){
				var gameTile = new GameTile("green", "green/tile.png");
				expect(gameTile.selected).to.be.false;
				//gameTile.setPlayer(jQuery('.sdds'));
				//expect(gameTile.setPlayer).to.be.an.instanceOf(gameTile.$player);
				expect(gameTile.selected).to.be.false;
			
			});
			
		/*	it("test $player",function(){
				var palyer
				
			});*/
		});

			
	});
});