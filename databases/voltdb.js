var VoltClient = require('voltjs/lib/client')
, VoltConstants = require('voltjs/lib/voltconstants');
var VoltProcedure = require('voltjs/lib/query');
var VoltQuery = require('voltjs/lib/query');
var VoltConfiguration = require('voltjs/lib/configuration');
var uuid = require('node-uuid');

var cfg = new VoltConfiguration();
cfg.host = "localhost";
cfg.port = 21212;

var getState = new VoltProcedure('GetGameState', ['string','string']);
var delState = new VoltProcedure('DelGameState', ['string','string']);
var delUser = new VoltProcedure('DelUser', ['string','string','string']);

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
