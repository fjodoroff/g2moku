g2moku.gameTiles = {
	availableTiles: [],
	allTiles: [],
	next: function(){
		return this.availableTiles.length > 0 ? this.availableTiles.pop() : false;
	},
	push: function(tile){
		this.availableTiles.push(tile);
	},
	selectTile: function($tile, $player){
		console.log($player.index());
		this.availableTiles.each(function(e, i){
			//console.log(this.availableTiles[$tile.index()]);
			if(e.key == g2moku.gameTiles.availableTiles[$tile.index()].key) {
				console.log('setPlayer');
				e.setPlayer($player);
			}
		});
	},
	selectedTile: function($player){
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
	},
	deselectTile: function($tile){
		var tile = this.availableTiles[$tile.index()];
		tile.unsetPlayer();
	},
	parseFromServer: function(callback){
		var serverResponse = {
			'green': {
				imgPath: '/assets/img/tiles/square1.png',
				index: 5
			},
			'yellow': {
				imgPath: '/assets/img/tiles/square2.png',
				index: 28
			},
			'rose': {
				imgPath: '/assets/img/tiles/square3.png',
				index: 54
			},
			'blue': {
				imgPath: '/assets/img/tiles/square5.png',
				index: 45
			}
		};
		for(key in serverResponse) {
			var tile = new gameTile(key, serverResponse[key]);
			this.allTiles.push(tile);
			this.availableTiles.push(tile);
		}
		console.log(this.availableTiles);
		callback(this);//returning back this object
	}
};