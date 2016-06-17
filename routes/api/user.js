"use strict";

let mongoose = require("mongoose")
,   _        = require("lodash")
,   bluebird = require("bluebird");

let EmailService    = require("../service/email")
,   ValidationError = require("../utils/ValidationError");

let User     = mongoose.model("User")
,   ObjectId = mongoose.Types.ObjectId;

let UserApi = {
  
  /**
   * Gets a user specified by id.
   * 
   * @param  {String} userId - the id of the user.
   *
   * @return {Object} the promise object.
   */
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
  
  /**
   * Gets a user specified by email
   * 
   * @param  {String} email - the email of the user.
   *
   * @return {Object} the promise object.
   */
  getByEmail: function(email) {

    return new Promise(function(resolve, reject) {
      User.findOne({email: email.toLowerCase()}).then((user) => {
        resolve(user);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  
  /**
   * Adds a new user using raw data.
   * 
   * @param  {Object} rawData - user info.
   *
   * @return {Object} the promise object.
   */
  add: function(rawData) {
    
    return new Promise(function(resolve, reject) {
      
      let email = rawData.email;
      
      User.findOne({email: email.toLowerCase()}).then((user) => {
        if (_.isEmpty(user)) {
          user = new User(rawData);
          
          return user.save().then(() => {
            return user;
          });
        } else {
          reject(new ValidationError("The specified email is already in use."));
        }
      })
      .then(function(newUser) {
        EmailService.sendLocalRegister(newUser.email, newUser.username)
        .then(function() {
          resolve(newUser);
        });
      })
      .catch((err) => {
        reject(err);
      });
      
    });
  },
  
  /**
   * Updates user specified by given id with new value.
   * 
   * @param  {String} id - the specified id.
   * @param  {Object} newProps - the new props to set.
   *
   * @return {Promise} the new promise object.
   */
  update: function(id, newProps) {

    return new Promise(function(resolve, reject) {
      
      User.findById(id).then(function(user) {
        if (_.isEmpty(user)) {
          reject("No user find by given id.");
        } else {
          _.assign(user, newProps);
          
          user.save().then(function(updatedUser) {
            resolve(updatedUser);
          }).catch(function(err) {
            reject(err);
          })
        }
      }).catch(function(err) {
        reject(err);
      });
      
    });
    
  },
  
  /**
   * Updates user specified by given email with new value.
   * 
   * @param  {String} email - the specified email.
   * @param  {Object} newProps - the new props to set.
   *
   * @return {Promise} the new promise object.
   */
  updateByEmail: function(email, newProps) {

    return new Promise(function(resolve, reject) {
      
      User.findOne({email: email}).then(function(user) {
        if (_.isEmpty(user)) {
          resolve(null);
        } else {
          _.assign(user, newProps);
          
          user.save().then(function(updatedUser) {
            resolve(updatedUser);
          }).catch(function(err) {
            reject(err);
          })
        }
      }).catch(function(err) {
        reject(err);
      });
      
    });
    
  },
  
  /**
   * Resets a user's password with given token.
   * 
   * @param  {String} token - the token used to reset the password.
   * @param  {Object} password - the new password.
   *
   * @return {Promise} the new promise object.
   */
  resetPasswordWithToken: function(token, password) {
    
    return new Promise(function(resolve, reject) {

      User.findOne({resetToken: token, resetExpire: {$gt: Date.now()}}).then(function(user) {

        if (_.isEmpty(user)) {
          resolve(null);
        } else {
          _.assign(user, {
            password: password,
            resetToken: undefined,
            resetExpire: undefined
          });
          
          user.save().then(function(updatedUser) {
            resolve(updatedUser);
          }).catch(function(err) {
            reject(err);
          })
        }
      }).catch(function(err) {
        reject(err);
      });
      
    });
  }

};

module.exports = UserApi;