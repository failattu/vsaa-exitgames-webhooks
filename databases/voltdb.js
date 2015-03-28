var VoltClient = require('voltjs/lib/client')
, VoltConstants = require('voltjs/lib/voltconstants');
var VoltProcedure = require('voltjs/lib/query');
var VoltQuery = require('voltjs/lib/query');
var VoltConfiguration = require('voltjs/lib/configuration');

var cfg = new VoltConfiguration();
cfg.host = "localhost";
cfg.port = 21212;

var getState = new VoltProcedure('GetGameState', ['string','string']);
var delState = new VoltProcedure('DelGameState', ['string','string']);
var delUser = new VoltProcedure('DelUser', ['string','string','string']);
var setState = new VoltProcedure('SetGameState', ['string','string', 'string']);
var setUser = new VoltProcedure('SetUser', ['string','string','string', 'string']);

var configs = []
configs.push(cfg);
var client = new VoltClient(configs);

client.connect(function startup(results,event,results) {
  console.log('Node up');
  dbinit();
}, function loginError(results) {
   console.log('Node Error)');
});

function dbinit()
{
  //TODO: add automatic db creation and first application
  console.log("initialization to here");
  connectionStats();
}

function connectionStats() {
  client.connectionStats();
}

exports.setUser = function (userID, appID,gameID, actorID, callback) {
   var query = setUser.getQuery()
   query.setParameters([userID,gameID,actorID,appID]);
   client.callProcedure(query, callback);
};
exports.delUser = function (userID, appID,gameID, callback) {
   var query = setUser.getQuery()
   query.setParameters([appID,gameID,userID]);
   client.callProcedure(query, callback);
};
exports.setGameState = function (appID,gameID, jsonData, callback) {
   var query = setState.getQuery()
   query.setParameters([jsonData,gameID,appID]);
   client.callProcedure(query, callback);
};
exports.getGameState = function (appID,gameID, callback) {
   var query = getState.getQuery()
   query.setParameters([gameID,appID]);
   client.callProcedure(query, callback);
};
exports.delGameState = function (appID,gameID, callback) {
   var query = delState.getQuery()
   query.setParameters([gameID,appID]);
   client.callProcedure(query, callback);
};
