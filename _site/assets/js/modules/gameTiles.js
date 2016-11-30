define(['GameTile'], function(GameTile) {
	var gameTiles = (function(gt) {
		gt.availableTiles = [];
		gt.allTiles = [];
		gt.next = function(){
			return this.availableTiles.length > 0 ? this.availableTiles.pop() : false;
		};
		gt.push = function(tile){
			this.availableTiles.push(tile);
		};
		gt.selectTile = function($tile, $player){
			console.log($player.index());
			//function(g){
			var g = this;
			this.availableTiles.each(function(e, i){
				//console.log(this.availableTiles[$tile.index()]);
				if(e.key == g.availableTiles[$tile.index()].key) {
					console.log('setPlayer');
					e.setPlayer($player);
				}
			});
			//}(this);
		};
		gt.selectedTile =  function($player){
			var tile = null;
			this.availableTiles.each(function(e, i){
				//console.log(this.availableTiles[$tile.index()]);
				//console.log(e.selected + " | " + e.$player.index() + "| " + $player.index());
				if(e.selected && e.$player.index() == $player.index()) {
					//console.log('gotcha');
					console.log(e);
					tile = e;
				}
			});
			return tile;
		};
		gt.deselectTile = function($tile){
			var tile = this.availableTiles[$tile.index()];
			console.log('deselect: ');
			console.log(tile);
			if(tile.selected) {
				tile.unsetPlayer();
			}
		};
		gt.parseFromServer = function(data, callback){
			for(key in data) {
				var tile = new GameTile(key, data[key]);
				this.allTiles.push(tile);
				this.availableTiles.push(tile);
			}
			console.log(this.availableTiles);
			callback(this);//returning back this object
		};
		return gt;
	}(gameTiles || {}));	
	return gameTiles;
});