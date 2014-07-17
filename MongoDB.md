vsaa-server-nodejs with MongoDB
===

Very Simple Application Analytics server made using Node.js, Restify, MongoDB and OAuth.

Prepare your database by executing following commands in your mongo prompt:

use vsaa

db.Applications.insert({"Name" : "app_name", "ApiKey" : "your_key", "ApiSecret" : "your_secret", "ApiSalt" : "your_salt" })

Make sure you have installed mongojs node module in addition to the modules described in readme.

