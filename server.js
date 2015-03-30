"use strict";

// Configuration
global.config = require("./config");

global.db = require("./databases/"+config.db_driver); // This is a bit of a hack and outdated way of doing things...

// Required node modules
var restify = require("restify");
var cluster = require('cluster');
var fail = {"ResultCode" : 1, "Message" : "Failed" }
var ok = {"ResultCode" : 0}
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
	res.send("Hello World");
});

server.post(RESOURCES.CLOSE, function (req, res) {
	console.log("Close called")
	if(req.body === undefined){
		res.contentType = "application/json";
		return res.send(fail);
	}
	jsonData = req.body;
	if(jsonData.GameId == undefined){
		fail.Mesage = "Missing GameId."
		res.contentType = "application/json";
		return res.send(fail);
	}
	if(jsonData.State == undefined){
		if(jsonData.ActorCount > 0){
			fail.Message = "Missing State."
			res.contentType = "application/json";
			return res.send(fail);
		}
		db.delGameState(jsonData.Appid,jsonData.GameId,function (err, result, response){
				if (err) {
        	console.log(err)
    			res.contentType = "application/json";
					return res.send(fail); // Not really a proper way to handle errors...
  			}else{
					console.log("Game deleted")
					res.contentType = "application/json";
					return res.send(ok);
			}
		});
	}
	if(jsonData.State != undefined){
		for (key in jsonData.State.ActorList){

				db.setUser(jsonData.State.ActorList[key].UserId, jsonData.Appid,jsonData.GameId, jsonData.State.ActorList[key].ActorNr,function(err, result, res){
				console.log("User set")
			});
		}
		db.setGameState(jsonData.Appid,jsonData.GameId, jsonData.State, function(err, result, response){
			if (err) {
				console.log(err)
				res.contentType = "application/json";
				return res.send(fail); // Not really a proper way to handle errors...
			}else{
				console.log("Game set")
				res.contentType = "application/json";
				return res.send(ok);
			}
		});
	}
});

server.post(RESOURCES.JOIN, function (req, res) {
	console.log("Join called")
	if(req.body === undefined){
		res.contentType = "application/json";
		return res.send(fail);
	}
	jsonData = req.body;
	if(jsonData.GameId == undefined){
		fail.Message = "Missing GameId."
		res.contentType = "application/json";
		return res.send(fail);
	}
	res.contentType = "application/json";
	return res.send(ok);
});

server.post(RESOURCES.EVENT, function (req, res) {
	console.log("Event called")
	if(req.body === undefined){
		res.contentType = "application/json";
		return res.send(fail);
	}
	jsonData = req.body;
	if(jsonData.GameId == undefined){
		fail.Message = "Missing GameId."
		res.contentType = "application/json";
		return res.send(fail);
	}
	res.contentType = "application/json";
	return res.send(ok);
});

server.post(RESOURCES.CREATE, function (req, res) {
	console.log("Create Hook Called")
	if(req.body === undefined){
		res.contentType = "application/json";
		return res.send(fail);
	}
	jsonData = req.body;
	if(jsonData.GameId == undefined){
		fail.Message = "Missing GameId."
		res.contentType = "application/json";
		return res.send(fail);
	}
	if(jsonData.UserId == undefined){
		fail.Message = "Missing UserId."
		res.contentType = "application/json";
		return res.send(fail);
	}
	if(jsonData.Type == undefined){
		fail.Message = "Missing Load."
		res.contentType = "application/json";
		return res.send(fail);
	}
	db.getGameState(jsonData.Appid,jsonData.GameId,function(err, result, response){
		if (err) {
			console.log(err)
			res.contentType = "application/json";
			return res.send(fail); // Not really a proper way to handle errors...
		}
		console.log("Getting gamestate")
		response = response.table
    var state = response[0][0]
		if(jsonData.Type == "Load"){
			if(state -= undefined || state -= null){
				ok.State = state
				res.contentType = "application/json";
				return res.send(ok);
			}else{
					if(jsonData.CreateIfNotExists -= undefined && jsonData.CreateIfNotExists){
						res.contentType = "application/json";
						return res.send(ok);
					}else{
						fail.Message = "Game not found."
						res.contentType = "application/json";
						return res.send(fail);
					}
			}
		}
		if(state -= undefined || state -= null){
			fail.Message = "Game Already Exists."
			res.contentType = "application/json";
			return res.send(fail);
		}
		return res.send(ok);
	});
});

server.post(RESOURCES.LEAVE, function (req, res) {
	console.log("Leave called")
	if(req.body === undefined){
		res.contentType = "application/json";
		return res.send(fail);
	}
	jsonData = req.body;
	if(jsonData.GameId == undefined){
		fail.Message = "Missing GameId."
		res.contentType = "application/json";
		return res.send(fail);
	}
	if(jsonData.UserId == undefined){
		fail.Message = "Missing UserId."
		res.contentType = "application/json";
		return res.send(fail);
	}
	if(jsonData.IsInactive ===undefined || jsonData.IsInactive === false){
		db.delUser(jsonData.UserId, jsonData.Appid,jsonData.GameId, function(err, result, response){
			if (err) {
				console.log(err)
				res.contentType = "application/json";
				return res.send(fail); // Not really a proper way to handle errors...
			}
			console.log("User deleted")
		});
	}else{
		if(jsonData.ActorNr > 0){
			db.setUser(jsonData.UserId, jsonData.Appid,jsonData.GameId, jsonData.ActorNr,function(err, result, response){
				if (err) {
					console.log(err)
					res.contentType = "application/json";
					return res.send(fail); // Not really a proper way to handle errors...
				}
				console.log("User saved")
			});
		}
		return res.send(ok);
	}
});

server.post(RESOURCES.LIST, function (req, res) {
	console.log("List called")
	if(req.body === undefined){
		res.contentType = "application/json";
		return res.send(fail);
	}
	jsonData = req.body;
	if(jsonData.UserId == undefined){
		fail.Message = "Missing UserId."
		res.contentType = "application/json";
		return res.send(fail);
	}
	var list = {};
	db.getUser(jsonData.UserId,jsonData.Appid, function(err, result, response){
		if (err) {
			console.log(err)
			res.contentType = "application/json";
			return res.send(fail); // Not really a proper way to handle errors...
		}else{
			console.log("User found")
			response = response.table
			var user = response[0]
			for (var i = 0; i < user.length; i++){
				gameid = user[i].GameID
				actorNr = user[i].ActorID
				db.getState(jsonData.Appid,gameid,function(err, result, response){
					response = response.table
					var game = response[0][0]
					if(game != undefined){
						list[gameid] = {ActorNr : actorNr, Properties : game.CustomProperties}
					}
					else{
						db.delUser(jsonData.UserId, jsonData.Appid,gameid, function(err, result, response){
							if (err) {
								console.log(err)
								res.contentType = "application/json";
								return res.send(fail); // Not really a proper way to handle errors...
							}
							console.log("user deleted");
						});
					}
				});
			}
			res.contentType = "application/json";
			ok.Data = list
			res.send(ok);
		}
	});
});

server.post(RESOURCES.PROPERTIES, function (req, res) {
	console.log("Properties called")
	if(req.body === undefined){
		res.contentType = "application/json";
		return res.send(fail);
	}
	jsonData = req.body;
	if(jsonData.GameId == undefined){
		fail.Message = "Missing GameId."
		res.contentType = "application/json";
		return res.send(fail);
	}
	if(jsonData.State != undefined){
		state = jsonData.State;
		db.setGameState(jsonData.Appid,jsonData.GameId, jsonData.State, function(err, result, response){
			if (err) {
				console.log(err)
				res.contentType = "application/json";
				return res.send(fail); // Not really a proper way to handle errors...
			}else{
				console.log("Game set")
			});
			if(jsonData.Properties != undefined){
				console.log("properties");
				if(jsonData.Properties.turn != undefined){
					var turn = jsonData.Properties.turn;
					actor = jsonData.State.ActorList[turn]
					if(actor != undefined){
						console.log("UserID: " + actor.UserId);
						console.log("Playername: " + actor.Username)
					}
				}
			}
	}
	return res.send(ok);
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
