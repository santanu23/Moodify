var http = require('http');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');
var config = require('./config');

var serve = serveStatic("./");

var server = http.createServer(function(req, res) {
  var done = finalhandler(req, res);
  serve(req, res, done);
});

var port = config.port || 8080;

server.listen(port);
console.log("Server listening on port " + port);
