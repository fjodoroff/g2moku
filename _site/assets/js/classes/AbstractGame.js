define(['prototype', 'utils'], function(proto, utils){
    //require('prototype'); // Ensure Prototype is present
	//NB !! on backend game object need g2moku property, on frontend not
    return Class.create({
		status: false,
		movingPlayer: false,//current moving player
		getMovingPlayer: function(){
			if(this.g2moku && this.g2moku.players && this.g2moku.players.currentPlaying) return this.g2moku.players.currentPlaying;
			return this.movingPlayer;
		},
		getStats: function(){
			var answer = this.toJSON();
			return answer;
		},
		getStatus: function(){
			return this.status;
		},
		getFormatedGameID: function(){
			return this.gameID ? this.gameID.substring(0, this.gameID.lastIndexOf('.')) : false;
		},
		setStatus: function(statusCode, status){
			if(utils.isObject(status)) {

			} else {
				this.status = {
					code: statusCode,
					msg: status
				};
			}
		},
		toJSON: function(){
			var js = {},
				players = this.g2moku.players.getPlaying();
            var playersList = [];
			if(this.status) js.status = this.status;
			if(this.getMovingPlayer()) js.movingPlayer = this.getMovingPlayer().getJSON();
			if(this.g2moku) {
				js.gameID = this.g2moku.gameID;
				js.players = players;
                for(var i = 0; i < players.length; i++) {
                    playersList.push(players[i].name);
                }
                js.playersList = playersList.join(", ");
				js.gameMode = this.g2moku.gameMode;
			} else {
				if(this.gameID) js.gameID = this.gameID;
			}
			//if(global) global.log.log('players: ' + JSON.stringify(js.players));
			return js;
		},
		initialize: function(data) {
			if(utils.isObject(data)) {
				this.tile = data.tile;
				this.timer = data.timer;
				if(data.gameID) this.gameID = data.gameID;
				if(data.players) this.players = data.players;
				if(data.status) this.status = data.status;
				if(data.gameMode) this.gameMode = data.gameMode;
				if(data.playersList) this.playersList = data.playersList;
				if(data.movingPlayer) this.movingPlayer = data.movingPlayer;
			}
		}
	});
});