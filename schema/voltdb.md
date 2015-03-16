Example VoltDB Schema for testing
===

VSAA uses very simple SQL Schema for data storage. It utilizes two tables, one for applications to store credentials and one for actual event data. Below you can find SQL CREATE script for preparing the database structure for vsaa.

SQL Create script
---
---

-- -----------------------------------------------------
-- Table `VSAA`.`Applications`
-- -----------------------------------------------------

CREATE TABLE Applications (
  Id INTEGER NOT NULL ,
  Name VARCHAR(64) NOT NULL ,
  ApiKey VARCHAR(64) NOT NULL ,
  ApiSecret VARCHAR(128) NOT NULL ,
  ApiSalt VARCHAR(64) NOT NULL ,
  PRIMARY KEY (Id)
);
PARTITION TABLE Applications ON COLUMN Id;


-- -----------------------------------------------------
-- Table `VSAA`.`Events`
-- -----------------------------------------------------

CREATE TABLE Events (
  `Id` INTEGER NOT NULL ,
  `DeviceIdentifier` VARCHAR(128) NOT NULL ,
  `Description` VARCHAR(255) NOT NULL ,
  `Logged` TIMESTAMP DEFAULT NOW ,
  `Applications_Id` INTEGER NOT NULL ,
  PRIMARY KEY (Id)
  );

CREATE INDEX Logtime ON towns (Logged);
PARTITION TABLE Events ON COLUMN Applications_Id;
