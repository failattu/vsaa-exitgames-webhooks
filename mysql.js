// Database related
'use strict';

var mysql   = require('mysql')
  , dbconnection = mysql.createConnection({
      host     : process.env.mysql_host,
      user     : process.env.mysql_user,
      password : process.env.mysql_password,
      database : process.env.mysql_database
    });

dbconnection.connect(function(err) {
  // connected! (unless `err` is set)
  if (err) {
    console.log("Error while connecting to database.");
  } else {
    console.log("Database connection successful.");
  }
});


function handleDisconnect(dbconnection) {
  dbconnection.on('error', function(err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);

    dbconnection = mysql.createConnection(dbconnection.config);
    handleDisconnect(dbconnection);
    dbconnection.connect();
  });
}

handleDisconnect(dbconnection);

// Testing with a table representing a simple analytics event list:
// CREATE TABLE `Events` (
//  `Id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
//  `ApplicationId` VARCHAR(64) NOT NULL ,
//  `Description` VARCHAR(255) NOT NULL ,
//  `Logged` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ,
//  PRIMARY KEY (`Id`) )
//  ENGINE = InnoDB;
// )

exports.createEvent = function (data, callback) {
  var queryData = {
    ApplicationId         : data[0],
    Description           : data[1]
  }
  dbconnection.query('INSERT INTO Events SET ?', queryData, callback);
};
