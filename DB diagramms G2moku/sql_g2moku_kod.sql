ALTER TABLE Game_World_Tile DROP CONSTRAINT FK_Game_World_Tile_ID;
ALTER TABLE Game_World DROP CONSTRAINT FK_Game_World_Player_opponent_games_ID;
ALTER TABLE Game_World DROP CONSTRAINT FK_Game_World_pk_Game_ID;
ALTER TABLE Game_Tile_Image DROP CONSTRAINT FK_Game_Tile_Image_Game_Tile_ID;
ALTER TABLE Game_Tile DROP CONSTRAINT FK_Game_Tile_Game_World_ID;
ALTER TABLE Game_Tile DROP CONSTRAINT FK_Game_Tile_World_ID;
ALTER TABLE Player_Move DROP CONSTRAINT FK_Player_Move_pk_Game_ID;
ALTER TABLE Player_Move DROP CONSTRAINT FK_Player_Move_pk_Player_ID;
ALTER TABLE Player_opponent_games DROP CONSTRAINT FK_Player_opponent_games_Game_ID;
DROP TABLE Game_World_Tile;
DROP TABLE Game_room;
DROP TABLE Game_World;
DROP TABLE Player;
DROP TABLE Game_Tile_Image;
DROP TABLE Game_Tile;
DROP TABLE Player_Move;
DROP TABLE Player_opponent_games;
DROP TABLE Game;
CREATE TABLE Game_room (
	Game_room_ID INTEGER NOT NULL,
	Game_ID INTEGER NOT NULL,
	World_name VARCHAR ( 255 ) NOT NULL,
	gameStart DATE NOT NULL,
	Player1_id INTEGER NOT NULL,
	Player2_id INTEGER NOT NULL,
	gameEnd DATE NOT NULL,
	Winner_ID INTEGER NOT NULL,
	CONSTRAINT PK_Game_room_ID PRIMARY KEY (Game_room_ID),
	CONSTRAINT TC_Game_room_Player1_id UNIQUE (Player1_id),
	CONSTRAINT TC_Game_room_Winner_ID UNIQUE (Winner_ID),
	CONSTRAINT TC_Game_room_Game_ID UNIQUE (Game_ID),
	CONSTRAINT TC_Game_room_Player2_id UNIQUE (Player2_id)
	);
CREATE TABLE Game_Tile (
	Game_Tile_ID INTEGER NOT NULL,
	Game_World_ID INTEGER NOT NULL,
	Game_World_Game_World_ID INTEGER NOT NULL,
	ID INTEGER NOT NULL,
	Name VARCHAR ( 255 ) NOT NULL,
	Game_Tile_Image VARCHAR ( 255 ) NOT NULL,
	Tile_ID INTEGER NOT NULL,
	Can_move SMALLINT NOT NULL,
	CONSTRAINT PK_Game_Tile_ID PRIMARY KEY (Game_Tile_ID)
	);
CREATE INDEX idx_Game_Tile_Game_World_ID ON Game_Tile (Game_World_ID );
CREATE INDEX idx_Game_Tile_Game_World_Game_World_ID ON Game_Tile (Game_World_Game_World_ID );
CREATE TABLE Player (
	PK_Player_ID INTEGER NOT NULL,
	ID INTEGER NOT NULL,
	Player_id INTEGER NOT NULL,
	Username VARCHAR ( 60 ) NOT NULL,
	Password VARCHAR ( 30 ) NOT NULL,
	E_mail VARCHAR ( 25 ) NOT NULL,
	Avatar VARCHAR ( 255 ) NOT NULL,
	CONSTRAINT PK_Player_ID PRIMARY KEY (PK_Player_ID),
	CONSTRAINT TC_Player_id UNIQUE (Player_id),
	CONSTRAINT TC_Player_Username UNIQUE (Username)
	);
CREATE TABLE Game_World (
	Game_World_ID INTEGER NOT NULL,
	PK_Game_ID INTEGER,
	Player_opponent_games_ID INTEGER,
	ID INTEGER NOT NULL,
	World_name VARCHAR ( 255 ) NOT NULL,
	World_size VARCHAR ( 255 ) NOT NULL,
	CONSTRAINT PK_Game_World_ID PRIMARY KEY (Game_World_ID)
	);
CREATE INDEX idx_Game_World_pk_Game_ID ON Game_World (PK_Game_ID );
CREATE INDEX idx_Game_World_Player_opponent_games_ID ON Game_World (Player_opponent_games_ID );
CREATE TABLE Game_World_Tile (
	Game_World_Tile_ID INTEGER NOT NULL,
	Game_Tile_Game_Tile_ID INTEGER NOT NULL,
	ID INTEGER NOT NULL,
	Game_World_ID INTEGER NOT NULL,
	Game_Tile_ID INTEGER NOT NULL,
	Game_World_X INTEGER NOT NULL,
	Game_World_Y INTEGER NOT NULL,
	CONSTRAINT PK_Game_World_Tile_ID PRIMARY KEY (Game_World_Tile_ID)
	);
CREATE INDEX idx_Game_World_Tile_ID ON Game_World_Tile (Game_Tile_Game_Tile_ID );
CREATE TABLE Game (
	PK_Game_ID INTEGER NOT NULL,
	ID INTEGER NOT NULL,
	Game_ID INTEGER NOT NULL,
	Player_id INTEGER NOT NULL,
	gameStart DATE NOT NULL,
	gameEnd DATE NOT NULL,
	Winner_ID INTEGER NOT NULL,
	CONSTRAINT PK_Game_ID PRIMARY KEY (PK_Game_ID),
	CONSTRAINT TC_Game_Game_ID UNIQUE (Game_ID),
	CONSTRAINT TC_GameWinner_ID UNIQUE (Winner_ID),
	CONSTRAINT TC_Game_Player_id UNIQUE (Player_id)
	);
CREATE TABLE Game_Tile_Image (
	Game_Tile_Image_ID INTEGER NOT NULL,
	Game_Tile_ID INTEGER NOT NULL,
	ID INTEGER NOT NULL,
	Path VARCHAR ( 255 ) NOT NULL,
	Tile_size VARCHAR ( 100 ) NOT NULL,
	CONSTRAINT PK_Game_Tile_Image_ID PRIMARY KEY (Game_Tile_Image_ID)
	);
CREATE INDEX idx_Game_Tile_Image_tile_id ON Game_Tile_Image (Game_Tile_ID );
CREATE TABLE Player_Move (
	Player_Move_ID INTEGER NOT NULL,
	PK_Player_ID INTEGER NOT NULL,
	PK_Game_ID INTEGER NOT NULL,
	ID INTEGER NOT NULL,
	Player_id INTEGER NOT NULL,
	Timer DATE NOT NULL,
	Game_ID INTEGER NOT NULL,
	Move_X INTEGER NOT NULL,
	Move_Y INTEGER NOT NULL,
	CONSTRAINT TC_Player_Move_Game_ID UNIQUE (Game_ID),
	CONSTRAINT TC_Player_Move_Player_id UNIQUE (Player_id),
	CONSTRAINT PK_Player_Move_ID PRIMARY KEY (Player_Move_ID)
	);
CREATE INDEX idx_Player_Move_pk_Game_ID ON Player_Move (PK_Game_ID );
CREATE INDEX idx_Player_Move_pk_Player_ID ON Player_Move (PK_Player_ID );
CREATE TABLE Player_opponent_games (
	Player_opponent_games_ID INTEGER NOT NULL,
	PK_Game_ID INTEGER,
	Player_id INTEGER NOT NULL,
	Game_ID INTEGER NOT NULL,
	Player1_id INTEGER NOT NULL,
	Player2_id INTEGER NOT NULL,
	Winner_ID INTEGER NOT NULL,
	CONSTRAINT TC_Player_opponent_games_Player1_id UNIQUE (Player1_id),
	CONSTRAINT TC_Player_opponent_games_Winner_ID UNIQUE (Winner_ID),
	CONSTRAINT TC_Player_opponent_games_Player_id UNIQUE (Player_id),
	CONSTRAINT TC_Player_opponent_games_Player2_id UNIQUE (Player2_id),
	CONSTRAINT PK_Player_opponent_games_ID PRIMARY KEY (Player_opponent_games_ID),
	CONSTRAINT TC_Player_opponent_games_Games_ID UNIQUE (Game_ID)
	);
CREATE INDEX idx_Player_opponent_games_pk_Game_ID ON Player_opponent_games (PK_Game_ID );
ALTER TABLE Game_World_Tile ADD CONSTRAINT FK_Game_World_Tile_ID FOREIGN KEY (Game_Tile_Game_Tile_ID) REFERENCES Game_Tile (Game_Tile_ID)  ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE Game_World ADD CONSTRAINT FK_Game_World_Player_opponent_games_ID FOREIGN KEY (Player_opponent_games_ID) REFERENCES Player_opponent_games (Player_opponent_games_ID)  ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE Game_World ADD CONSTRAINT FK_Game_World_pk_Game_ID FOREIGN KEY (PK_Game_ID) REFERENCES Game (PK_Game_ID)  ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE Game_Tile_Image ADD CONSTRAINT FK_Game_Tile_Image_Game_Tile_ID FOREIGN KEY (Game_Tile_ID) REFERENCES Game_Tile (Game_Tile_ID)  ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE Game_Tile ADD CONSTRAINT FK_Game_Tile_Game_World_ID FOREIGN KEY (Game_World_ID) REFERENCES Game_World (Game_World_ID)  ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE Game_Tile ADD CONSTRAINT FK_Game_Tile_World_ID FOREIGN KEY (Game_World_Game_World_ID) REFERENCES Game_World (Game_World_ID)  ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE Player_Move ADD CONSTRAINT FK_Player_Move_pk_Game_ID FOREIGN KEY (PK_Game_ID) REFERENCES Game (PK_Game_ID)  ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE Player_Move ADD CONSTRAINT FK_Player_Move_pk_Player_ID FOREIGN KEY (PK_Player_ID) REFERENCES Player (PK_Player_ID)  ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE Player_opponent_games ADD CONSTRAINT FK_Player_opponent_games_Game_ID FOREIGN KEY (PK_Game_ID) REFERENCES Game (PK_Game_ID)  ON DELETE NO ACTION ON UPDATE NO ACTION;

