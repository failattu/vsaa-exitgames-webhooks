// Database related
'use strict';

var mongojs = require("mongojs");

// We assume the MongoDB host is local and no auth has been set. 
// TODO: Modify for auth
var uri = "vsaa"; 

var dbconnection = mongojs.connect(uri, ["Applications","Events"]);

var storeEvent = function (data, appid, callback)
{
	dbconnection.Events.insert({ DeviceId: data[0],
								 Description: data[1],
								 Logged: Date.now(),
								 Applications_Id: appid},callback);
}

exports.createEvent = function (data, callback) {
	dbconnection.Applications.find({ApiKey:data[2]}, function(err,res)
	{
		storeEvent(data,res[0]._id,callback);
	});
}

exports.getApps = function (callback) {
	dbconnection.Applications.find({},{ "_id": 0, "ApiKey": 1 , "ApiSecret": 1 },callback);
}


