define(['prototype', 'Player', 'Timer'], function(proto, Player, Timer){
	//if (typeof window === 'undefined') {
	var base64 = require('base64');
	//}
	return Class.create({
        // ������ �������� ���� ����� � ���� ������� this.board[id ������� ������] = ��� ������
        board: [],
        // ����� �� ������
        stepsToWin: 5,
        // ���-�� ��������� �����
        steps: 0,
        MAX_PLAYERS: 4,
        exceptions: require('exceptions'),
        gameTiles: require('gameTiles'),
        debug: false,
        mapWidth: 150,
        mapHeight: 150,
        history: {
            games: {},
            getNextID: function () {
                return Object.keys(this.games).length;
            },
            toJSON: function () {
                var json = {},
                    keys = Object.keys(this.games);
                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i],
                        e = this.games[k];
                    json[k] = e.toJSON();
                }
                return json;
            }
        },
        layer: null,
        gameMode: false,
        canvas: null,
        genID: false,
        gameID: false,
        timer: null,
        gameStarted: false,
        playerMoving: false,
        addHistory: function (playerMove) {
            if (playerMove.id !== undefined) this.history.games[playerMove.id] = playerMove;
            else this.history.games[this.history.getNextID()] = playerMove;
        },
        step: function (x, y, player, cb) {
            // ��������� ��� � ���� ������ ������ ���
            if (this.board[x + 'x' + y] !== undefined) return;
            // �������� ��������� X � Y ���� ��� ������ ���, ��������� � ������ ����� �� ��� ���������� ��� ����
            this.board[x + 'x' + y] = player.playingTile.index;
            // ����������� ������� ��������� �����
            //this.steps++;
            // �������� ����� � ��� ����������� ����� ���������� ������� �������� ��
            cb(g.checkWinner(x, y, player.playingTile.index), player.playingTile.index);
        },
        checkWinner: function (x, y, turn) {
            // // �������� �� �����, ���� ��� ������ ��������� �����
            // if(this.steps == (this.x * this.y)) {
            // // �����
            // return 'none';
            // // �������� �� ����������
            if (
            // �������� ���������� �� ������ ������������
                this.checkWinnerDynamic('-', x, y, turn)
                || this.checkWinnerDynamic('|', x, y, turn)
                || this.checkWinnerDynamic('\\', x, y, turn)
                || this.checkWinnerDynamic('/', x, y, turn)
                ) {
                // ���� ����������
                return true;
            } else {
                // // ��� ����������
                return false;
            }
        },
        checkWinnerDynamic: function (a, x, y, turn) {
            // ����� ��������� ����������� 4 ����������: �����������, ��������� � 2 ���������
            // ��� ���� �� �� ����� �� ����� ������� ������� ���,, ��������� ����� �� ���� 4 ������������
            var win = 1;
            //if(global && global.log) global.log.logAction("Checking in direction: " + a + ", tile: [" + x +  ", " + y +  "], turnsToWin:" + turn + " " + g.stepsToWin);
            switch (a) {

                // ����� �� �����������
                case '-':
                    var toLeft = toRight = true,
                        min = x - this.stepsToWin, max = x + this.stepsToWin;
                    min = (min < 1) ? 1 : min;
                    max = (max > this.mapWidth) ? this.mapWidth : max;
                    for (var i = 1; i <= this.stepsToWin; i++) {
                        if (win >= this.stepsToWin) return true;
                        if (!toLeft && !toRight) return false;
                        if (toLeft && min <= (x - i) && this.board[(x - i) + 'x' + y] == turn) {
                            win++;
                        } else {
                            toLeft = false;
                        }
                        if (toRight && (x + i) <= max && this.board[(x + i) + 'x' + y] == turn) {
                            win++;
                        } else {
                            toRight = false;
                        }
                    }
                    break;

                // ����� �� ���������
                case '|':
                    var toUp = toDown = true,
                        min = y - this.stepsToWin, max = y + this.stepsToWin;
                    min = (min < 1) ? 1 : min;
                    max = (max > this.mapHeight) ? this.mapHeight : max;
                    for (var i = 1; i <= this.stepsToWin; i++) {
                        if (win >= this.stepsToWin) return true;
                        if (!toUp && !toDown) return false;
                        if (toUp && min <= (y - i) && this.board[x + 'x' + (y - i)] == turn) {
                            win++;
                        } else {
                            toUp = false;
                        }
                        if (toDown && (y + i) <= max && this.board[x + 'x' + (y + i)] == turn) {
                            win++;
                        } else {
                            toDown = false;
                        }
                    }
                    break;

                // ����� �� ��������� ������ ����
                case '\\':
                    var toUpLeft = toDownRight = true,
                        minX = x - this.stepsToWin, maxX = x + this.stepsToWin,
                        minY = y - this.stepsToWin, maxY = y + this.stepsToWin;
                    minX = (minX < 1) ? 1 : minX;
                    maxX = (maxX > this.mapWidth) ? this.mapWidth : maxX;
                    minY = (minY < 1) ? 1 : minY;
                    maxY = (maxY > this.mapHeight) ? this.mapHeight : maxY;
                    for (var i = 1; i <= this.stepsToWin; i++) {
                        if (win >= this.stepsToWin) return true;
                        if (!toUpLeft && !toDownRight) return false;
                        if (toUpLeft && minX <= (x - i) && minY <= (y - i) && this.board[(x - i) + 'x' + (y - i)] == turn) {
                            win++;
                        } else {
                            toUpLeft = false;
                        }
                        if (toDownRight && (x + i) <= maxX && (y + i) <= maxY && this.board[(x + i) + 'x' + (y + i)] == turn) {
                            win++;
                        } else {
                            toDownRight = false;
                        }
                    }
                    break;

                // ����� �� ��������� ����� �����
                case '/':
                    var toDownLeft = toUpRight = true,
                        minX = x - this.stepsToWin, maxX = x + this.stepsToWin,
                        minY = y - this.stepsToWin, maxY = y + this.stepsToWin;
                    minX = (minX < 1) ? 1 : minX;
                    maxX = (maxX > this.mapWidth) ? this.mapWidth : maxX;
                    minY = (minY < 1) ? 1 : minY;
                    maxY = (maxY > this.mapHeight) ? this.mapHeight : maxY;
                    for (var i = 1; i <= this.stepsToWin; i++) {
                        if (win >= this.stepsToWin) return true;
                        if (!toDownLeft && !toUpRight) return false;
                        if (toDownLeft && minX <= (x - i) && (y + i) <= maxY && this.board[(x - i) + 'x' + (y + i)] == turn) {
                            win++;
                        } else {
                            toDownLeft = false;
                        }
                        if (toUpRight && (x + i) <= maxX && (y - i) <= maxY && this.board[(x + i) + 'x' + (y - i)] == turn) {
                            win++;
                        } else {
                            toUpRight = false;
                        }
                    }
                    break;

                default:
                    return false;
                    break;
            }
            return(win >= g.stepsToWin);
        },
        initHandlers: function () {

        },
        getGameID: function () {
            return this.gameID;
        },
        generateID: function (genID, callback) {
            if (genID === false) {
                var newGenID = +new Date(),
                    preGenerated = this.players.length;
                callback(preGenerated, newGenID);
            } else {
                callback(false, this.genID);
            }
        },
        initialize: function () {
            this.gameErrors = {
                gameMenu: []
            };
            this.initHandlers();
        }
    });
});