define(['AbstractG2moku'], function(AbstractG2moku){
	var g2 = (function(g) {
		g.initHandlers = function(){
			console.log('mapHeight' + g.mapHeight);
		};
		g.initialize = function(){
			this.gameErrors = {
				gameMenu: []
			};
			this.initHandlers();
		};		
		return g;
	}(new AbstractG2moku() || {})); 
	return Class.create(AbstractG2moku, g2);
});