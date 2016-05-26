"use strict";

let mongoose = require("mongoose")
,   bluebird = require("bluebird");

let ValidationError = require("../utils/ValidationError");

let User     = mongoose.model("User")
,   ObjectId = mongoose.Types.ObjectId;

let UserApi = {
  get: function(userId) {
    return new Promise(function(resolve, reject) {
      User.findById(ObjectId(userId), function(err, user) {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  },
  
  add: function(rawData) {
    return new Promise(function(resolve, reject) {
      let user = new User(rawData);
      
      user.save(function(err, newUser) {
        if (err) {
          if (err.errors) {
            if (err.errors["local.username"]) {
              return reject(new ValidationError(err.errors["local.username"].message));
            }

            if (err.errors["local.email"]) {
              return reject(new ValidationError(err.errors["local.email"].message));
            }
          }
          
          reject(err);
        } else {
          resolve(newUser);
        }
      });
    });
  }

};

module.exports = UserApi;