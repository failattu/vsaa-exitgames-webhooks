"use strict";

module.exports = {

	// Default port to listen
	listen : 8080,

	// Database driver
	db_driver : "voltdb",

	// Number of worker threads. Default is the number of CPUs.
	workers : require('os').cpus().length,
}
