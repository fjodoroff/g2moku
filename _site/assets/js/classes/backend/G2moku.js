define(['AbstractG2moku', 'games'], function(AbstractG2moku, games){
	var g2 = (function(g) {
		g.initHandlers = function(){
			//console.log('mapHeight' + g.mapHeight);
		};
		g.games = games;
		g.sockets = function(){
			
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