"use strict";

// Database driver selection

var db_driver = "./databases/";
if (process.env.vsaa_dbms) {
	db_driver += process.env.vsaa_dbms;
}
else {
    db_driver += "mysql";
}


// Required node modules
var restify = require("restify");
var restifyOAuth2 = require("restify-oauth2");
var cluster = require('cluster');


// Process variables

global.db = require(db_driver); // This is a bit of a hack and outdated way of doing things...

var numCPUs = require('os').cpus().length;
var port = 8080; // Default port to listen

if (process.argc >= 2) {
	port = parseInt(process.argv[2]); // Port can be also passed as an argument
}

var hooks = require("./hooks");
var server = restify.createServer({
	name: "Very Simple Application Analytics Server",
	version: "0.0.3",
	formatters: {
		"application/hal+json": function (req, res, body) {
			return res.formatters["application/json"](req, res, body);
		}
	}
});

var RESOURCES = Object.freeze({
	INITIAL: "/",
	TOKEN: "/login",
	EVENT: "/event"
});

server.use(restify.authorizationParser());
server.use(restify.bodyParser({ mapParams: false }));
	restifyOAuth2.cc(server, { tokenEndpoint: RESOURCES.TOKEN, hooks: hooks });
server.get(RESOURCES.INITIAL, function (req, res) {
	var response = {
		_links: {
			self: { href: RESOURCES.INITIAL }
		}
	};

	if (req.clientId) {
		response._links["http://rel.example.com/event"] = { href: RESOURCES.EVENT };
	} else {
		response._links["oauth2-token"] = {
			href: RESOURCES.TOKEN,
			"grant-types": "client_credentials",
			"token-types": "bearer"
		};
	}

	res.contentType = "application/hal+json";
	res.send(response);
});

server.post(RESOURCES.EVENT, function (req, res) {
	if (!req.clientId) {
		return res.sendUnauthenticated();
	}
	var fields = [
		req.body.DeviceId,
		req.body.Description,
		req.body.ApiKey
	];
	var response = {
		"success": "event recorded successfully",
		_links: {
			self: { href: RESOURCES.EVENT },
			parent: { href: RESOURCES.INITIAL }
		}
	}
	db.createEvent(fields, function (err, result) {
		if (err) {
			response = {
				"error": "err",
				_links: {
					self: { href: RESOURCES.EVENT },
					parent: { href: RESOURCES.INITIAL }
				}
			}
		}
	});
	if (req.body.message_type === 'APPLICATION_EVENT_QUIT')
		hooks.invalidateClientToken(req.authorization.credentials);
	res.contentType = "application/hal+json";
	res.send(response);
});

// Adding error information...
process.on('uncaughtException', function (err) {
	console.log("UNCAUGHT EXCEPTION ");
	console.log("[Inside 'uncaughtException' event] " + err.stack || err.message);
});

// Clustering to utilize all CPU cores
if (cluster.isMaster) {

    // Fork workers, one for each CPU.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function (worker, code, signal) {
    	console.log('worker ' + worker.process.pid + ' died');
    	cluster.fork();
    });
} 
else {
    server.listen(port);
}