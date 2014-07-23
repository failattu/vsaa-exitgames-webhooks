// Database related
'use strict';

var sql = require('mssql');

var dbconnection = new sql.Connection(config.mssql);
dbconnection.connect(function (err) {
    // connected! (unless `err` is set)
    if (err) {
        console.log("Error while connecting to database.");
    } else {
        console.log("Database connection successful.");
    }
});


function handleDisconnect(dbconnection) {
    dbconnection.on('error', function (err) {
        if (!err.fatal) {
            return;
        }

        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
            throw err;
        }

        console.log('Re-connecting lost connection: ' + err.stack);

        dbconnection = new sql.Connection(config);
        handleDisconnect(dbconnection);
        dbconnection.connect();
    });
}

handleDisconnect(dbconnection);

exports.createEvent = function (data, callback) {
    var request = new sql.Request(dbconnection);
    // Inserting our data and making sure it goes under correct app by FK
    var queryDB = 'INSERT INTO Events (DeviceIdentifier,Description , Applications_Id) SELECT \'' + data[0] + '\' ,\'' + data[1] + '\' , Id FROM Applications WHERE ApiKey = \'' + data[2] + ' \' ';
    request.query(queryDB, callback);
};

exports.getApps = function (callback) {
    var request = new sql.Request(dbconnection);
    request.query('SELECT ApiKey, ApiSecret FROM Applications', callback);
}



