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

exports.createEvent = function (data, callback) {
	console.log(data);
	// Inserting our data and making sure it goes under correct app by FK
	var sql = 'INSERT INTO Events SET DeviceIdentifier =' + dbconnection.escape(data[0]) +
			  ',Description = '+ dbconnection.escape(data[1])+
			  ', Applications_Id = (SELECT Id FROM Applications WHERE ApiKey = '+dbconnection.escape(data[2])+')'; 
	console.log(sql);
	dbconnection.query(sql, callback);
};

exports.getApps = function (callback) {
	dbconnection.query('SELECT ApiKey, ApiSecret FROM Applications', callback);
}


