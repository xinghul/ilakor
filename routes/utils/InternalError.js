"use strict";

function InternalError(message) {
  Error.call(this);
  
  this.status = 500;
  this.message = message || "Internal error occurs, please contact supports.";
}

InternalError.prototype = Object.create(Error.prototype);

module.exports = InternalError;
