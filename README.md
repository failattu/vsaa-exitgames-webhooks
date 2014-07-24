vsaa-server-nodejs
==================

Very Simple Application Analytics server made using Node.js, Restify, MySQL and OAuth.

Intented to run in conjuction with [vsaa](https://github.com/eimink/vsaa) application plugin.

Based on examples from
[restify-oauth2](https://github.com/domenic/restify-oauth2) and 
[node-mysql-json-server](https://github.com/frodefi/node-mysql-json-server).

This project depends on several npm packages. Make sure you have npm packages restify, restify-oauth2, underscore, crypto, sharedmemory and mysql/mongodb installed before trying to run it. Easiest way to take care of this on Linux and OS X is to run install.sh, which does the module installations for you.

v.0.0.3
---
* Clustering and memory sharing between workers
* Support for MongoDB and MSSQL

v.0.0.2
---
Moved app credentials to MySQL and changed the example schema. It is now provided as a separate file.

v.0.0.1
---
Initial commit with two REST entry points:

* /login for authentication
* /event for storing events to database


