define(['prototype', 'Player', 'Timer'], function(proto, Player, Timer){
	var g2 = (function(g) {
		// Ячейки игрового поля будут в виде объекта this.board[id игровой ячейки] = чем ходили
		g.board = [];
		// Шагов до победы
		g.stepsToWin = 5;
		// Кол-во сделанных ходов
		g.steps = 0;
		g.MAX_PLAYERS = 4;
		g.exceptions = require('exceptions');
		g.debug = true;
		g.$box = null;
		g.mapWidth = 150;
		g.mapHeight = 150;
		g.history = [];
		g.layer = null;  
		g.cursors = null;
		g.marker = null;
		g.currentTile = null;
		g.sprites = null;
		g.canvas = null;
		g.firstTime = true;
		g.gameStarted = false;
		g.playerMoving = false;
		g.canUpdateMarker = true;
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
			console.log(a + " " + x +  " " + y +  " " + turn + " " + g.stepsToWin);	
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
		g.gameTiles = require('gameTiles');
		g.players = {
			arr: [],
			playing: [],
			getPlaying: function(){
				var a = [];
				this.playing.each(function(e, i){
					a.push(e.getJSON());
				});
				return a;
			},
			currentPlaying: false,
			willPlay: function(player){
				var newArr = [player];
				for(var i = 0; i < this.playing.length; i++) {
					newArr.push(this.playing[i]);
				}
				this.playing = newArr;
			},		
			getLast: function(){
				return this.playing.length > 0 ? this.playing[this.playing.length - 1] : false;
			},
			next: function(){
				if(this.playing.length == 0 && g.gameStarted) this.playing = this.arr;
				//this.playing[this.playing.length - 1].startTimer();
				var ans = this.playing.length > 0 /*&& g.gameStarted*/ ? this.playing.pop() : false;
				this.currentPlaying = ans;
				console.log(ans);
				return ans;
			},
			parseFromGameModal: function(data){
				var pl = this;
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
					pl.arr.push(player);				
				});
				this.playing = this.arr;
				return this.arr;
			},
		};
		g.initialize = function(){
			this.gameErrors = {
				gameMenu: []
			};
			this.initHandlers();
		};
		return g;
	}(g2 || {}));  
	return Class.create(g2);
});