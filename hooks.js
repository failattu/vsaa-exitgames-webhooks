"use strict";

var _ = require("underscore");
var crypto = require("crypto");
var initSharedMemory = require("sharedmemory").init;
var sharedMemoryController = initSharedMemory();

// This could be changed to SQL based solution, but for speed it is nice to have these in RAM...
var clients = { };
var tokensToDeviceIds = { };
sharedMemoryController.set('clients',clients);
sharedMemoryController.set('tokens',tokensToDeviceIds);

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
  		sharedMemoryController.set('clients',apps);
	});
}

refreshAppDatabase(); // Fetch our api keys from the database

function generateToken(data) {
    var random = Math.floor(Math.random() * 100001);
    var timestamp = (new Date()).getTime();
    var sha256 = crypto.createHmac("sha256", random + "DERP" + timestamp);

    return sha256.update(data).digest("base64");
}

exports.invalidateClientToken = function (token) {
	sharedMemoryController.get('tokens', function (data) {
		data = _.omit(data,token);
		sharedMemoryController.set('tokens',data);
	});
}

exports.grantClientToken = function (credentials, req, cb) {
	
	refreshAppDatabase(); // Lets refresh our database... this, however isn't instant so refactoring is needed...
	
	sharedMemoryController.get('clients',function(data){
		var isValid = _.has(data, credentials.clientId) &&
					  data[credentials.clientId] === credentials.clientSecret;
		if (isValid) {
			// If the client authenticates, generate a token for them and store it so `exports.authenticateToken` below
			// can look it up later.
			var token = generateToken(credentials.clientId + ":" + credentials.clientSecret);
			sharedMemoryController.get('tokens', function (data) {
				data[token] = req.body.DeviceId;
				sharedMemoryController.set('tokens',data);
			});

			// Call back with the token so Restify-OAuth2 can pass it on to the client.
			return cb(null, token);
		}

		// Call back with `false` to signal the username/password combination did not authenticate.
		// Calling back with an error would be reserved for internal server error situations.
		cb(null, false);
    });
};

exports.authenticateToken = function (token, req, cb) {
	sharedMemoryController.get('tokens', function (data) {
   		if (_.has(data, token)) {
        // If the token authenticates, set the corresponding property on the request, and call back with `true`.
        // The routes can now use these properties to check if the request is authorized and authenticated.
        	req.clientId = data[token];
        	return cb(null, true);
    	}
    // If the token does not authenticate, call back with `false` to signal that.
    // Calling back with an error would be reserved for internal server error situations.
    cb(null, false);
    });
};
