"use strict";

var _ = require("underscore");
var crypto = require("crypto");

// This could be changed to a more appropriate, SQL based solution, but for speed it is nice to have these in RAM...
var database = {
    clients: {
        clientApplication: "CCC9934845FDB409D5B279EB26181B10BB856763"
    },
    tokensToDeviceIds: {},
};

function refreshAppDatabase()
{
	db.getApps(function (err, result) {
    	if (err) {
    		return; // Not really a proper way to handle errors...
  		}
  		var apps = {};
  		for (var i = 0; i < result.length; i++)
  		{
  			apps[result[i].ApiKey] = result[i].ApiSecret;
  		}
  		var tokens = database.tokensToDeviceIds;
  		database = {
  			clients: apps,
  			tokensToDeviceIds: tokens
  		};
	});
}

refreshAppDatabase(); // Fetch our api keys from the database

function generateToken(data) {
    var random = Math.floor(Math.random() * 100001);
    var timestamp = (new Date()).getTime();
    var sha256 = crypto.createHmac("sha256", random + "DERP" + timestamp);

    return sha256.update(data).digest("base64");
}

exports.invalidateClientToken = function (token)
{
	database.tokensToDeviceIds = _.omit(database.tokensToDeviceIds,token); // Grab the token our client has used and remove it from list
}

exports.grantClientToken = function (credentials, req, cb) {
	
	refreshAppDatabase(); // Lets refresh our database... this, however isn't instant so refactoring is needed...
	
    var isValid = _.has(database.clients, credentials.clientId) &&
                  database.clients[credentials.clientId] === credentials.clientSecret;
    if (isValid) {
        // If the client authenticates, generate a token for them and store it so `exports.authenticateToken` below
        // can look it up later.
        var token = generateToken(credentials.clientId + ":" + credentials.clientSecret);
        database.tokensToDeviceIds[token] = req.body.DeviceId;

        // Call back with the token so Restify-OAuth2 can pass it on to the client.
        return cb(null, token);
    }

    // Call back with `false` to signal the username/password combination did not authenticate.
    // Calling back with an error would be reserved for internal server error situations.
    cb(null, false);
};

exports.authenticateToken = function (token, req, cb) {
    if (_.has(database.tokensToDeviceIds, token)) {
        // If the token authenticates, set the corresponding property on the request, and call back with `true`.
        // The routes can now use these properties to check if the request is authorized and authenticated.
        req.clientId = database.tokensToDeviceIds[token];
        return cb(null, true);
    }

    // If the token does not authenticate, call back with `false` to signal that.
    // Calling back with an error would be reserved for internal server error situations.
    cb(null, false);
};
