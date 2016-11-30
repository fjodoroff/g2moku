define(['chai', 'AbstractPlayerMove','GameTile','Timer','Player', 'utils'], function(chai, AbstractPlayerMove, GameTile, Timer,Player, utils) {
	var expect = chai.expect;
	describe("AbstractPlayerMove test", function() {
		describe("constructor",function(){
			it("passing object as argument", function() {
				var obj = {};
				expect(utils.isObject(obj)).to.be.true;
			});
			it("should be an Object with true arguments", function(){
				var move = new AbstractPlayerMove({
					tile: new GameTile({
						imgPath: ""
					}),
					timer: new Timer(1000, function(timer){

					})
				});
				expect(move.tile).to.be.an.instanceOf(GameTile);
				expect(move.timer).to.be.an.instanceOf(Timer);
			});
			it("should be player with name", function(){
				var move = new AbstractPlayerMove({
					player: new Player("Player")
				});
				expect(move.player).to.be.an.instanceOf(Player);
			});
		});
	});
});