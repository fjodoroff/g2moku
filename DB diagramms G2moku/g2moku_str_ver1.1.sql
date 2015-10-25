ALTER TABLE Game_World_Tile DROP CONSTRAINT FK_Game_World_Tile17;
ALTER TABLE Game_Tile DROP CONSTRAINT FK_Game_Tile19;
ALTER TABLE Game_World DROP CONSTRAINT FK_Game_Game_ID;
ALTER TABLE Game_World DROP CONSTRAINT FK_Game_Player_opponent_games_ID;
ALTER TABLE Game_Tile_Image DROP CONSTRAINT FK_Game_Tile_Image11;
ALTER TABLE Player_Move DROP CONSTRAINT FK_Player_Move15;
ALTER TABLE Player_Move DROP CONSTRAINT FK_Player_Move18;
ALTER TABLE Player_opponent_games DROP CONSTRAINT FK_Player_Games_ID;
DROP TABLE Game_World_Tile;
DROP TABLE Game_Tile;
DROP TABLE Game_World;
DROP TABLE Player;
DROP TABLE Game_Tile_Image;
DROP TABLE Player_Move;
DROP TABLE Player_opponent_games;
DROP TABLE Game;
CREATE TABLE Player_opponent_games (
	Player_opponent_games_ID INTEGER NOT NULL,
	Game_Game_ID INTEGER,
	Player_ID INTEGER NOT NULL,
	Game_ID INTEGER NOT NULL,
	Player1_id INTEGER NOT NULL,
	Player2_id INTEGER NOT NULL,
	CONSTRAINT TC_Player_opponent_Player2_id UNIQUE (Player2_id),
	CONSTRAINT TC_Player_opponent_Game_ID UNIQUE (Game_ID),
	CONSTRAINT PK_Player_opponent_games_ID PRIMARY KEY (Player_opponent_games_ID),
	CONSTRAINT TC_Player_opponent_Player1_id UNIQUE (Player1_id),
	CONSTRAINT TC_Player_ID UNIQUE (Player_ID)
	);
CREATE INDEX idx_Player_opponent_games_ID ON Player_opponent_games (Player_opponent_games_ID );
CREATE TABLE Game (
	Game_ID INTEGER NOT NULL,
	gameStart DATE NOT NULL,
	gameEnd DATE NOT NULL,
	Player1_id INTEGER NOT NULL,
	Player2_id INTEGER NOT NULL,
	Winner_ID INTEGER NOT NULL,
	CONSTRAINT PK_Game_ID PRIMARY KEY (Game_ID),
	CONSTRAINT TC_Game_Winner_ID UNIQUE (Winner_ID),
	CONSTRAINT TC_Game_Player2_id UNIQUE (Player2_id),
	CONSTRAINT TC_Game_Player1_id UNIQUE (Player2_id)
	);
CREATE INDEX idx_Game_ID ON Game (Game_ID );
CREATE TABLE Player (
	Player_ID INTEGER NOT NULL,
	Username VARCHAR ( 255 ) NOT NULL,
	Password VARCHAR ( 255 ) NOT NULL,
	E-mail VARCHAR ( 255 ) NOT NULL,
	Avatar VARCHAR ( 255 ) NOT NULL,
	CONSTRAINT PK_Player_ID PRIMARY KEY (Player_ID),
	CONSTRAINT TC_Player_E_mail UNIQUE (E-mail),
	CONSTRAINT TC_Player_Username UNIQUE (Username)
	);
CREATE INDEX idx_Player_ID ON Player (Player_ID );
CREATE TABLE Game_World (
	Game_World_ID INTEGER NOT NULL,
	Player_opponent_games_ID INTEGER,
	Game_ID INTEGER,
	World_name VARCHAR ( 255 ) NOT NULL,
	World_size VARCHAR ( 255 ) NOT NULL,
	CONSTRAINT PK_Game_World_ID PRIMARY KEY (Game_World_ID)
	);
CREATE INDEX idx_Game_World_ID ON Game_World (Game_World_ID );
CREATE INDEX idx_Player_opponent_game_ID ON Game_World (Player_opponent_games_ID );
CREATE TABLE Game_World_Tile (
	Game_World_Tile_ID INTEGER NOT NULL,
	Game_Tile_ID INTEGER NOT NULL,
	Game_World_ID INTEGER NOT NULL,
	Game_World_X INTEGER NOT NULL,
	Game_World_Y INTEGER NOT NULL,
	CONSTRAINT PK_Game_World_Tile16 PRIMARY KEY (Game_World_Tile_ID)
	);
CREATE INDEX TC_Game_World_Tile26 ON Game_World_Tile (Game_Tile_ID );
CREATE TABLE Game_Tile_Image (
	Game_Tile_Image_ID INTEGER NOT NULL,
	Game_Tile_ID INTEGER NOT NULL,
	Path VARCHAR ( 255 ) NOT NULL,
	Tile_Size VARCHAR ( 255 ) NOT NULL,
	CONSTRAINT PK_Game_Tile_Image14 PRIMARY KEY (Game_Tile_Image_ID)
	);
CREATE INDEX TC_Game_Tile_Image25 ON Game_Tile_Image (Game_Tile_ID );
CREATE TABLE Player_Move (
	Player_Move_ID INTEGER NOT NULL,
	Player_ID INTEGER NOT NULL,
	Game_ID INTEGER NOT NULL,
	Timer DATE NOT NULL,
	Move_X INTEGER NOT NULL,
	Move_Y INTEGER NOT NULL,
	CONSTRAINT PK_Player_Move13 PRIMARY KEY (Player_Move_ID)
	);
CREATE INDEX idx_Player_Move_ID ON Player_Move (Player_Move_ID );
CREATE TABLE Game_Tile (
	Game_Tile_ID INTEGER NOT NULL,
	Name VARCHAR ( 255 ) NOT NULL,
	Game_Tile_Image VARCHAR ( 255 ) NOT NULL,
	Tile_ID INTEGER NOT NULL,
	Can_Move SMALLINT NOT NULL,
	Game_World_ID INTEGER NOT NULL,
	CONSTRAINT PK_Game_Tile15 PRIMARY KEY (Game_Tile_ID)
	);
ALTER TABLE Game_World_Tile ADD CONSTRAINT FK_Game_World_Tile17 FOREIGN KEY (Game_Tile_ID) REFERENCES Game_Tile (Game_Tile_ID)  ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE Game_Tile ADD CONSTRAINT FK_Game_Tile19 FOREIGN KEY (Game_World_ID) REFERENCES Game_World (Game_World_ID)  ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE Game_World ADD CONSTRAINT FK_Game_Game_ID FOREIGN KEY (Game_ID) REFERENCES Game (Game_ID)  ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE Game_World ADD CONSTRAINT FK_Game_Player_opponent_games_ID FOREIGN KEY (Player_opponent_games_ID) REFERENCES Player_opponent_games (Player_opponent_games_ID)  ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE Game_Tile_Image ADD CONSTRAINT FK_Game_Tile_Image11 FOREIGN KEY (Game_Tile_ID) REFERENCES Game_Tile (Game_Tile_ID)  ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE Player_Move ADD CONSTRAINT FK_Player_Move15 FOREIGN KEY (Player_ID) REFERENCES Player (Player_ID)  ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE Player_Move ADD CONSTRAINT FK_Player_Move18 FOREIGN KEY (Game_ID) REFERENCES Game (Game_ID)  ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE Player_opponent_games ADD CONSTRAINT FK_Player_Games_ID FOREIGN KEY (Game_Game_ID) REFERENCES Game (Game_ID)  ON DELETE NO ACTION ON UPDATE NO ACTION;

