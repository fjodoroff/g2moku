define(['chai', 'AbstractG2moku', 'Player'], function(chai, AbstractG2moku, Player) {
    var expect = chai.expect;
    describe("AbstractG2moku test", function() {
        var ag2moku = new AbstractG2moku();
        it("constructor", function () {
            expect(ag2moku).to.be.an.instanceOf(AbstractG2moku);
        });
        it("step method test", function () {
            var player1 = new Player("Player1"),
                player2 = new Player("Player2");
            ag2moku.step(1, 1, player1, function(win, tileIndex){
                ag2moku.step(2, 5, player2, function(win2, tileIndex2){

                });
            });
            //expect().to.be.an.instanceOf(AbstractG2moku);
        });
    });
});