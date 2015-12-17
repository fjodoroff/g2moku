define(['AbstractPlayer', 'prototype', 'Timer', 'PlayerMove'], function(AbstractPlayer, proto, Timer, PlayerMove){
	var p = Class.create();
	// inherit from Person class:
	p.prototype = Object.extend(new AbstractPlayer(), {
		moveToTile: function(tile, layer, db_id, callback) {
			//this.moves.push(tile);
			//if(tile) this.playingTile = new Phaser.Tile(layer, 15);
			//callback('asas');
			this.endMove(tile, db_id, callback);
		},
        db_id: false,
        create: function(callback){ //create new player in database
            var player = this;
            global.pool.query('INSERT INTO `player` (Username, playingName) VALUES (?, ?)', ["Player-" + (Date.now() + Math.floor((Math.random() * 10) + 1)), this.name], function(err, result) {
                if (err) throw err;
                console.log(result.insertId);
                player.db_id = result.insertId;
                callback(player);
            });
        },
        endMove: function(tile, db_id, callback){
            var t = this;
            this.timer.clear();
            //console.log('DB_ID' + db_id);
            var playerMove = new PlayerMove({
                tile: tile,
                timer: this.timer,
                player: this,
                game_db_id: db_id
            });

            //g2moku.history.push(playerMove);
            this.moving = false;
            //console.log('moving = false');
            this.afterEndMove(playerMove, function(playerMove){
                t.moves.push(playerMove);
                callback(playerMove);
            });
            //g2moku.players.willPlay(this);
        },
        afterEndMove: function(playerMove, callback) {
            var player = this;
            //console.log(playerMove);
            global.pool.query('INSERT INTO `player_move` (Player_ID, Game_ID, Move_X, Move_Y) VALUES (?, ?, ?, ?)', [playerMove.player.db_id, playerMove.game_db_id, playerMove.tile.x, playerMove.tile.y], function(err, result) {
                if (err) throw err;
                //console.log(result.insertId);
                playerMove.db_id = result.insertId;
                //player.db_id = result.insertId;
                callback(playerMove);
            });
        },
		startTimer: function(){
			var p = this;
			this.startMove();
			this.timer = new Timer(1000, function(tim){
/*				var numbers = (new Date((tim.count * 1000))).toISOString().match(/(\d{2}:\d{2}:\d{2})/);
				p.$box.find('.time-elapsed').text(numbers[0]);*/
			});
		}
	}); 
	return p;
});