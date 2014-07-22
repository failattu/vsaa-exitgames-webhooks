Example MySQL Schema for testing
===

VSAA uses very simple SQL Schema for data storage. It utilizes two tables, one for applications to store credentials and one for actual event data. Below you can find SQL CREATE script for preparing the database structure for vsaa.

SQL Create script
---
---


SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

CREATE SCHEMA IF NOT EXISTS `VSAA` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `VSAA` ;

-- -----------------------------------------------------
-- Table `VSAA`.`Applications`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `VSAA`.`Applications` ;

CREATE  TABLE IF NOT EXISTS `VSAA`.`Applications` (
  `Id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `Name` VARCHAR(64) NOT NULL ,
  `ApiKey` VARCHAR(64) NOT NULL ,
  `ApiSecret` VARCHAR(128) NOT NULL ,
  `ApiSalt` VARCHAR(64) NOT NULL ,
  PRIMARY KEY (`Id`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `VSAA`.`Events`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `VSAA`.`Events` ;

CREATE  TABLE IF NOT EXISTS `VSAA`.`Events` (
  `Id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `DeviceIdentifier` VARCHAR(128) NOT NULL ,
  `Description` VARCHAR(255) NOT NULL ,
  `Logged` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ,
  `Applications_Id` INT UNSIGNED NOT NULL ,
  PRIMARY KEY (`Id`) ,
  FULLTEXT INDEX `Description` (`Description` ASC) ,
  INDEX `Logtime` (`Logged` ASC) ,
  INDEX `fk_Events_Applications_idx` (`Applications_Id` ASC) ,
  CONSTRAINT `fk_Events_Applications`
    FOREIGN KEY (`Applications_Id` )
    REFERENCES `VSAA`.`Applications` (`Id` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;