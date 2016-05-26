"use strict";

function ValidationError(message) {
  Error.call(this);
  
  this.status = 422;
  this.message = message;
}

ValidationError.prototype = Object.create(Error.prototype);

module.exports = ValidationError;
