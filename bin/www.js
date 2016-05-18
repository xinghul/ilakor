"use strict";

/**
* Module dependencies.
*/

let app = require("../server")
,   debug = require("debug")("test:server")
,   http = require("http")
,   https = require("https")
,   fs = require("fs")
,   path = require("path");

/**
* Get port from environment and store in Express.
*/

let httpPort = app.get("http_port")
,   httpsPort = app.get("https_port");

/**
* Gets SSL certificates.
*/

let privateKey = fs.readFileSync(path.join(__dirname, "credentials/rootCA.key"))
,   certificate = fs.readFileSync(path.join(__dirname, "credentials/rootCA.pem"))
,   options = {
  key: privateKey, 
  cert: certificate
};

/**
* Create HTTP server.
*/

let server = http.createServer(app).listen(httpPort);

https.createServer(options, app).listen(httpsPort, function() {
  console.log("HTTPS server listening on port " + httpsPort);
});

/**
* Listen on provided port, on all network interfaces.
*/

server.on("error", onError);
server.on("listening", onListening);

/**
* Event listener for HTTP server "error" event.
*/

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  
  let bind = typeof httpPort === "string" ? "Pipe " + httpPort
                                      : "Port " + httpPort
  
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
* Event listener for HTTP server "listening" event.
*/

function onListening() {
  let addr = server.address(),
  bind = typeof addr === "string" ? "pipe " + addr
                                  : "port " + addr.port;
  console.log("Listening on " + bind);
}

// for mocha testing
module.exports = server
