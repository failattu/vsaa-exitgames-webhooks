Example VoltDB Schema for testing
===

SQL Create script
---
---

-- -----------------------------------------------------
-- Table `VSAA`.`GameState`
-- -----------------------------------------------------

CREATE TABLE GameState (
  AppID VARCHAR(128) NOT NULL ,
  GameID VARCHAR(128) NOT NULL ,
  JSONData VARCHAR(1240) NOT NULL ,
  PRIMARY KEY (GameID, AppID)
);
PARTITION TABLE GameState ON COLUMN GameID;


-- -----------------------------------------------------
-- Table `VSAA`.`UserGame`
-- -----------------------------------------------------

CREATE TABLE UserGame (
  AppID VARCHAR(128) NOT NULL ,
  UserID VARCHAR(255) NOT NULL ,
  GameID VARCHAR(128) NOT NULL,
  ActorID VARCHAR(128) NOT NULL
  );
PARTITION TABLE UserGame ON COLUMN GameID;

-- -------------------------------------------------------
--Java Help
-- -------------------------------------------------------

javac -cp "$CLASSPATH:/opt/voltdb/voltdb/*" SetGameState.java
javac -cp "$CLASSPATH:/opt/voltdb/voltdb/*" SetUser.java

jar cvf storedprocs.jar *.class

-- -------------------------------------------------------
--Queries
-- -------------------------------------------------------

load classes storedprocs.jar;

CREATE PROCEDURE FROM CLASS SetGameState ;

CREATE PROCEDURE GetGameState AS SELECT JSONData FROM GameState WHERE AppID = ? AND GameID = ?;

CREATE PROCEDURE DelGameState AS DELETE FROM GameState WHERE AppID =? AND GameID =?;

CREATE PROCEDURE FROM CLASS SetUser ;

CREATE PROCEDURE DelUser AS DELETE FROM UserGame WHERE AppID = ? AND GameID = ? AND UserID = ?;
