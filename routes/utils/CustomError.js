"use strict";

function CustomError(status, message) {
  Error.call(this);
  
  this.status = status;
  this.message = message;
}

CustomError.prototype = Object.create(Error.prototype);

module.exports = CustomError;
