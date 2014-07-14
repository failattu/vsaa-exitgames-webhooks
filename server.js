"use strict";

var restify = require("restify");
var restifyOAuth2 = require("restify-oauth2");
var hooks = require("./hooks");
var db = require("./mysql");

var server = restify.createServer({
    name: "Very Simple Application Analytics Server",
    version: "0.0.1",
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
    	req.body.ApiKey,
    	req.body.Description,
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
				"error":  "err",
				_links: {
					self: { href: RESOURCES.EVENT },
					parent: { href: RESOURCES.INITIAL }
				}
			}
  		}
  	});
    res.contentType = "application/hal+json";
    res.send(response);
});

// Adding error information...

process.on('uncaughtException', function (err) {
    console.log( "UNCAUGHT EXCEPTION " );
    console.log( "[Inside 'uncaughtException' event] " + err.stack || err.message );
});

server.listen(8080);