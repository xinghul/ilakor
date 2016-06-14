"use strict";

let mongoose = require("mongoose")
,   _        = require("lodash")
,   bluebird = require("bluebird");

let User     = mongoose.model("User")
,   ObjectId = mongoose.Types.ObjectId;

let LocalUtil = {
  /**
   * Removes a user by id.
   * @param  {String} id the id.
   *
   * @return {Promise} the promise object.
   */
  remove: function(id) {
    return new Promise(function(resolve, reject) {
      User.remove({_id: id}).then(resolve).catch(reject);
    });
  }
};

let FacebookUtil = {
  /**
   * Removes a user by facebook id.
   * @param  {String} id facebook id.
   *
   * @return {Promise} the promise object.
   */
  remove: function(id) {
    return new Promise(function(resolve, reject) {
      User.remove({ "facebook.id": id }).then(resolve).catch(reject);
    });
  }
};

module.exports = {
  local: LocalUtil,
  facebook: FacebookUtil
};