define(['prototype', 'Player', 'Timer'], function(proto, Player, Timer){
	//if (typeof window === 'undefined') {
	var base64 = require('base64');
	//}
	var g2 = (function(g) {
		// Ячейки игрового поля будут в виде объекта this.board[id игровой ячейки] = чем ходили
		g.board = [];
		// Шагов до победы
		g.stepsToWin = 5;
		// Кол-во сделанных ходов
		g.steps = 0;
		g.MAX_PLAYERS = 4;
		g.exceptions = require('exceptions');
		g.gameTiles = require('gameTiles');
		g.debug = true;
		g.mapWidth = 150;
		g.mapHeight = 150;
		g.history = {
			games: {},
			getNextID: function(){
				return Object.keys(this.games).length;
			},
			toJSON: function(){
				var json = {},
					keys = Object.keys(this.games);
				for(var i = 0; i < keys.length; i++){
					var k = keys[i],
						e = this.games[k];
					json[k] = e.toJSON();
				}
				return json;
			}
		};
		g.layer = null;
		g.gameMode = false;
		g.canvas = null;
		g.genID = false;
		g.gameID = false;
		g.timer = null;
		g.gameStarted = false;
		g.playerMoving = false;
		g.addHistory = function(playerMove){
			if(playerMove.id !== undefined) this.history.games[playerMove.id] = playerMove;
			else this.history.games[this.history.getNextID()] = playerMove;
		};
		g.step = function(x, y, player, cb) {
			// Проверяем что в этой клетке ничего нет
			if(g.board[x + 'x' + y] !== undefined) return;
			// Получаем параметры X и Y куда был сделан ход, добавляем в объект ходов на эти координаты кто пошёл
			g.board[x + 'x' + y] = player.playingTile.index;
			// Увеличиваем счётчик сделанных ходов
			//this.steps++;
			// Обратный вызов у нас срабатывает после выполнения функции проверки на		
			cb(g.checkWinner(x, y, player.playingTile.index), player.playingTile.index);
		};
		g.checkWinner = function(x, y, turn) {
			// // Проверка на ничью, если нет больше свободных полей 
			// if(this.steps == (this.x * this.y)) {
				// // Ничья
				// return 'none';
				// // Проверка на победителя
			if(
				// Проверка комбинаций на победу пользователя
				g.checkWinnerDynamic('-', x, y, turn)
					|| g.checkWinnerDynamic('|', x, y, turn)
					|| g.checkWinnerDynamic('\\', x , y, turn)
					|| g.checkWinnerDynamic('/', x, y, turn)
				) {
				// есть победитель
				return true;
			} else {
				// // нет победителя
				return false;
			}
		};
		g.checkWinnerDynamic = function(a, x, y, turn) {
			// будем проверять динамически 4 комбинации: горизонталь, вертикаль и 2 диагонали
			// при этом мы не знаем на какой позиции текущий ход,, проверять будем во всех 4 направлениях
			var win = 1;
			//if(global && global.log) global.log.logAction("Checking in direction: " + a + ", tile: [" + x +  ", " + y +  "], turnsToWin:" + turn + " " + g.stepsToWin);
			switch(a) {

				// поиск по горизонтали
				case '-':
					var toLeft = toRight = true,
						min = x - g.stepsToWin, max = x + g.stepsToWin;
					min = (min < 1) ? 1 : min;
					max = (max > g.mapWidth) ? g.mapWidth : max;
					for(var i = 1; i <= g.stepsToWin; i++) {
						if(win >= g.stepsToWin) return true;
						if(!toLeft && !toRight) return false;
						if(toLeft && min <= (x-i) && g.board[(x-i) + 'x' + y] == turn) { win++; } else { toLeft = false; }
						if(toRight && (x+i) <= max && g.board[(x+i) + 'x' + y] == turn) { win++; } else { toRight = false; }
					}
					break;

				// поиск по вертикали
				case '|':
					var toUp = toDown = true,
						min = y - g.stepsToWin, max = y + g.stepsToWin;
					min = (min < 1) ? 1 : min;
					max = (max > g.mapHeight) ? g.mapHeight : max;
					for(var i = 1; i <= g.stepsToWin; i++) {
					   if(win >= g.stepsToWin) return true;
					   if(!toUp && !toDown) return false;
					   if(toUp && min <= (y-i) && g.board[x + 'x' + (y-i)] == turn) { win++; } else { toUp = false; }
					   if(toDown && (y+i) <= max && g.board[x + 'x' + (y+i)] == turn) { win++; } else { toDown = false; }
					}
				break;

				// поиск по диагонали сверху вниз
				case '\\':
					var toUpLeft = toDownRight = true,
						minX = x - g.stepsToWin, maxX = x + g.stepsToWin,
						minY = y - g.stepsToWin, maxY = y + g.stepsToWin;
					minX = (minX < 1) ? 1 : minX;
					maxX = (maxX > g.mapWidth) ? g.mapWidth : maxX;
					minY = (minY < 1) ? 1 : minY;
					maxY = (maxY > g.mapHeight) ? g.mapHeight : maxY;
					for(var i = 1; i <= g.stepsToWin; i++) {
					   if(win >= g.stepsToWin) return true;
					   if(!toUpLeft && !toDownRight) return false;
					   if(toUpLeft && minX <= (x-i) && minY <= (y-i) && g.board[(x-i) + 'x' + (y-i)] == turn) { win++; } else { toUpLeft = false; }
					   if(toDownRight && (x+i) <= maxX && (y+i) <= maxY && g.board[(x+i) + 'x' + (y+i)] == turn) { win++; } else { toDownRight = false; }
					}
				break;

				// поиск по диагонали снизу вверх
				case '/':
					var toDownLeft = toUpRight = true,
						minX = x - g.stepsToWin, maxX = x + g.stepsToWin,
						minY = y - g.stepsToWin, maxY = y + g.stepsToWin;
					minX = (minX < 1) ? 1 : minX;
					maxX = (maxX > g.mapWidth) ? g.mapWidth : maxX;
					minY = (minY < 1) ? 1 : minY;
					maxY = (maxY > g.mapHeight) ? g.mapHeight : maxY;
					for(var i = 1; i <= g.stepsToWin; i++) {
						if(win >= g.stepsToWin) return true;
						if(!toDownLeft && !toUpRight) return false;
						if(toDownLeft && minX <= (x-i) && (y+i) <= maxY && g.board[(x-i) + 'x' + (y+i)] == turn) { win++; } else { toDownLeft = false; }
						if(toUpRight && (x+i) <= maxX && (y-i) <= maxY && g.board[(x+i) + 'x' + (y-i)] == turn) { win++; } else { toUpRight = false; }
					}
				break;

				default: return false; break;
			}
			return(win >= g.stepsToWin);
		};
		g.initHandlers = function(){};
		g.getGameID = function(){
			return this.gameID;
		};
		g.generateID = function(genID, callback){
			if(genID ===  false) {
				var newGenID = +new Date(),
					preGenerated = g.players.length;
				callback(preGenerated, newGenID);
			} else {
				callback(false, this.genID);
			}
		};
		g.initialize = function(){
			this.players = (function(pl){
				pl.arr = [];
				pl.playing = [];
				pl.getPlayers = function(){
					var a = [];
					this.arr.each(function(e, i){
						a.push(e.getJSON());
					});
					return a;
				};
				pl.getPlaying = function(){
					var a = [];
					this.playing.each(function(e, i){
						a.push(e.getJSON());
					});
					return a;
				};
				pl.clear = function(){
					this.currentPlaying.$box.remove();
					this.playing.each(function(e, i){
						e.$box.remove();
					});
					this.playing = [];
					this.currentPlaying = false;
				};
				pl.currentPlaying = false;
				pl.willPlay = function(player){
					var newArr = [player];
					for(var i = 0; i < this.playing.length; i++) {
						newArr.push(this.playing[i]);
					}
					this.playing = newArr;
				};
				pl.getLast = function(){
					return this.playing.length > 0 ? this.playing[this.playing.length - 1] : false;
				};
				pl.next = function(gameStarted){
					//if(this.playing.length == 0) this.playing = this.arr;
					//this.playing[this.playing.length - 1].startTimer();
					var ans = this.playing.length > 0 ? this.playing.pop() : false;
					this.currentPlaying = ans;
					//console.log(ans);
					return ans;
				};
				pl.parseFromGameModal = function(data){
					var arr = [];
					//console.log('//parsefromgameModal each data');
					//console.log(data);
					data.each(function(e, i){
						// console.log('//tile i');
						// console.log(i);
						// console.log('//tile e');
						// console.log(e);
						var player = new Player({
							name: e.input,
							tile: e.tile,
							playingTileIndex: e.tileIndex
						});
						player.setPlayingTile(new Phaser.Tile(g.layer, e.tileIndex));
						arr.push(player);
					});
					this.arr = arr;
					this.playing = arr;
					//this.arr = arr;
					return arr;
				};
				pl.createPlayers = function(data){
					var arr = [];
					//console.log('//parsefromgameModal each data');
					//console.log(data);
					data.each(function(e, i){
						// console.log('//tile i');
						// console.log(i);
						// console.log('//tile e');
						// console.log(e);
						var player = new Player({
							name: e.name,
							tile: e.tile,
							playingTile: e.playingTile
						});
						//player.setPlayingTile(new Phaser.Tile(g.layer, e.tileIndex));
						arr.push(player);
					});
					this.arr = arr;
					this.playing = arr;
					//this.arr = arr;
					return arr;
				};
				return pl;
			}(this.players || {}));
			this.gameErrors = {
				gameMenu: []
			};
			this.initHandlers();
		};
		return g;
	}(g2 || {}));  
	return Class.create(g2);
});