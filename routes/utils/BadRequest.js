"use strict";

let _ = require("lodash");

function BadRequest(message) {
  Error.call(this);
  
  this.status = 400;
  this.message = message || "Bad request.";
}

BadRequest.prototype = Object.create(Error.prototype);

module.exports = BadRequest;
