"use strict";

let mongoose = require("mongoose")
,   bluebird = require("bluebird");

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
            let errObj = {};
            
            errObj["collision"] = true;

            if (err.errors["local.username"]) {
              errObj["usernameError"] = err.errors["local.username"].message;
            }

            if (err.errors["local.email"]) {
              errObj["emailError"] = err.errors["local.email"].message;
            }

            return reject(errObj);
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