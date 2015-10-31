define(['chai', 'utils'], function(chai, utils) {
	var expect = chai.expect;
	describe("Util test", function() {
			it("passing object as argument", function() {
				var obj = {};		
				expect(isObject(obj)).to.be.true;
			});
			it("passing null argument",function() {
				expect(isObject(null)).to.be.false;
			});
			it("passing function as argument", function() {
				var obj = function(){
					
				};		
				expect(isObject(obj)).to.be.true;
			});
	});
});