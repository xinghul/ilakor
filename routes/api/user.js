"use strict";

let mongoose = require("mongoose")
,   bluebird = require("bluebird");

let EmailService    = require("../service/email")
,   ValidationError = require("../utils/ValidationError");

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
            if (err.errors["username"]) {
              return reject(new ValidationError(err.errors["username"].message));
            }

            if (err.errors["email"]) {
              return reject(new ValidationError(err.errors["email"].message));
            }
          }
          
          reject(err);
        } else {
          EmailService.sendLocalRegister(newUser.email)
          .then(function() {
            resolve(newUser);
          });
        }
      });
    });
  },
  
  /**
   * Updates user specified by given query with new value.
   * 
   * @param  {Object} query the specified query.
   * @param  {Object} newProps the new props to set.
   *
   * @return {Promise} the new promise object.
   */
  update: function(query, newProps) {

    return new Promise(function(resolve, reject) {
      
      User.findOneAndUpdate(query, {$set: newProps}, {new: true}, function(err, updatedUser) {
        if (err) {
          reject(err);
        } else {
          resolve(updatedUser);
        }
      });
      
    });
    
  },

};

module.exports = UserApi;