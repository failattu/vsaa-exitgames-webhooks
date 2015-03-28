"use strict";

// Configuration
global.config = require("./config");

global.db = require("./databases/"+config.db_driver); // This is a bit of a hack and outdated way of doing things...

// Required node modules
var restify = require("restify");
var cluster = require('cluster');

// Process variables

var server = restify.createServer({
	name: "Very Simple Application Analytics Server",
	version: "0.0.3",
	formatters: {
		"application/hal+json": function (req, res, body) {
			return res.formatters["application/json"](req, res, body);
		}
	}
});

var port = config.listen; // Default port to listen

if (process.argc >= 2) {
	port = parseInt(process.argv[2]); // Port can be also passed as an argument, this overrides config...
}

var RESOURCES = Object.freeze({
	INITIAL: "/",
	CLOSE: "/GameClose",
	JOIN: "/GameJoin",
	EVENT: "/GameEvent",
	CREATE: "/GameCreate",
	LEAVE: "/GameLeave",
	LIST: "/GetGameList",
	PROPERTIES: "/GameProperties"
});


server.get(RESOURCES.INITIAL, function (req, res) {

});

server.post(RESOURCES.CLOSE, function (req, res) {

});

server.post(RESOURCES.JOIN, function (req, res) {

});

server.post(RESOURCES.EVENT, function (req, res) {

});

server.post(RESOURCES.CREATE, function (req, res) {

});

server.post(RESOURCES.LEAVE, function (req, res) {

});

server.post(RESOURCES.LIST, function (req, res) {

});

server.post(RESOURCES.PROPERTIES, function (req, res) {

});
// Adding error information output, and killing process when this happens.
process.on('uncaughtException', function (err) {
	console.log("UNCAUGHT EXCEPTION ");
	console.log("[Inside 'uncaughtException' event] " + err.stack || err.message);
	process.exit(1);
});

// Clustering to utilize all CPU cores
if (cluster.isMaster) {

    // Fork workers
    for (var i = 0; i < config.workers; i++) {
        cluster.fork();
    }

    cluster.on('exit', function (worker, code, signal) {
    	console.log('Worker ' + worker.process.pid + ' died');
    	console.log('Spawining new worker...');
    	cluster.fork();
    });
}
else {
    server.listen(port);
}
