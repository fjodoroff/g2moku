describe('example test', function(){
    it('confirms 2+2 = 4', function(){
        expect(2+2).toEqual(4);
    });
    it('confirms 3+3 = 6', function(){
        expect(3+3).toEqual(6);
    });
});
describe("isHTML test", function() {
    it("passing object as argument", function() {
        expect(utils.isHTML({})).to.be.false;
    });
    it("passing HTML as argument", function() {
        expect(utils.isHTML("<button>asass</button>")).to.be.true;
    });
});
describe("isObject test", function() {
    it("passing object as argument", function() {
        var obj = {};
        expect(utils.isObject(obj)).to.be.true;
    });
    it("passing null argument",function() {
        expect(utils.isObject(null)).to.be.false;
    });
    it("passing function as argument", function() {
        var obj = function(){

        };
        expect(utils.isObject(obj)).to.be.true;
    });
});
describe("isArray test", function() {
    it("passing object as argument", function() {
        expect(utils.isArray({})).to.be.false;
    });
    it("passing string as argument", function() {
        expect(utils.isArray("sdsd")).to.be.false;
    });
    it("passing array as argument", function() {
        expect(utils.isArray([1,2,3])).to.be.true;
    });
});
describe("getFormatedGameID test", function() {
    var gameID = "asdasdasd.asdasdaasdwf";
    it("testing gameID [" + gameID + "]", function() {
        expect(utils.getFormatedGameID(gameID)).to.be.string;
        expect(utils.getFormatedGameID(gameID)).to.equal("asdasdasd");
    });
    it("testing gameID [asdasdasd]", function() {
        expect(utils.getFormatedGameID("asdasdasd")).to.be.false;
    });
});
describe("deepDiffMapper test", function() {
    describe("map method test", function() {
        var testObj1 = {
                "array" : [
                    1, 2, 3
                ],
                "object": {},
                "function": function(){

                },
                "new": "new",
                "updated": "",
                "undefined": undefined
            },
            testObj2 = {
                "array" : [
                    1, 2, 3
                ],
                "object": {},
                "updated": "updated",
                "deleted": "deleted",
                "function": function(){

                }
            };
        it("testing testObj1: " + JSON.stringify(testObj1) + ", testObj2: " + JSON.stringify(testObj2), function(){
            var answer = utils.deepDiffMapper.map(testObj1, testObj2);
            //expect(utils.getFormatedGameID(gameID)).to.be.string;
            //expect(utils.getFormatedGameID(gameID)).to.equal("asdasdasd");
        });
        it("testing function as a argument", function(){
//                expect(utils.deepDiffMapper.map(function(){
//
//                }, {}));
            //expect(utils.getFormatedGameID(gameID)).to.equal("asdasdasd");
        });
    });
});
