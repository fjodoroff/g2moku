define(['chai', 'utils'], function(chai, utils) {
	var expect = chai.expect;
	describe("isHTML test", function() {
		it("passing object as argument", function() {	
			expect(isHTML({})).to.be.false;
		});	
		it("passing HTML as argument", function() {
			expect(isHTML("<button>asass</button>")).to.be.true;
		});			
	});
	describe("isObject test", function() {
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