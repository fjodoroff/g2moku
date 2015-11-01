define(['chai', 'Player', 'GameTile', 'utils'], function(chai, Player, GameTile, utils) {
	var expect = chai.expect;
	describe("GameTile test", function() {
		var gameTile = new GameTile("green", "green/tile.png");
		describe("Player methods",function(){
			it("passing object as argument", function() {
				var obj = {};		
				expect(isObject(obj)).to.be.true;
			});
			it("testing setPlayer method",function(){
				expect(gameTile.selected).to.be.false;
				gameTile.setPlayer(jQuery('.sdds'));
				expect(gameTile.$player).to.be.not.null;
				expect(gameTile.$player).to.be.an.instanceOf(jQuery);		
			});
			it("testing unsetPlayer",function(){
				gameTile.unsetPlayer();
				expect(gameTile.$player).to.be.null;
				expect(gameTile.selected).to.be.false
			});
			it("testing getHTML to be html object and contains button",function(){
				var HTML = gameTile.getHTML();
				expect(isHTML(HTML)).to.be.true;
				expect(HTML).and.contain('button');
			});
		});
	}); 
});