"use strict";

var mongoose = require("mongoose")
,   passport = require("passport");

var User     = mongoose.model("User")
,   ObjectId = mongoose.Types.ObjectId;

var UserApi = {
  
  /**
   * Creates a new user.
   * 
   * @param  {Request}  req  the request object.
   * @param  {Response} res  the response object.
   * @param  {Function} next the next middleware.
   *
   * req.body:
   * {
   * 	local.email: String
   * 	local.username: String
   * 	local.password: String
   * }
   */
  create: function(req, res, next) {
    var newUser = new User(req.body);
    
    // do a check here
    newUser.save(function(err) {
      if (err) {
        var errObj = {};

        if (err.errors["local.username"]) {
          errObj.usernameError = err.errors["local.username"].message;
        }

        if (err.errors["local.email"]) {
          errObj.emailError = err.errors["local.email"].message;
        }

        return next(errObj);
      }

      req.logIn(newUser, function(err) {
        if (err) {
          return next(err);
        }

        return res.json(newUser.infoLocal);
      });
    });
  },
  
  /**
   * Returns user specified by given user id, if it exists.
   * 
   * @param  {Request}   req  the request object.
   * @param  {Response}  res  the response object.
   * @param  {Function} next the next middleware.
   */
  get: function(req, res, next) {
    var userId = req.params.userId;

    User.findById(ObjectId(userId), function(err, user) {
      if (err) {
        return next(new Error("Failed to load User"));
      }
      
      if (user) {
        res.json(user.infoLocal);
      } else {
        res.send(404, "USER NOT FOUND")
      }
    });
  },
  
  /**
   * Returns all users.
   * 
   * @param  {Request}   req  the request object.
   * @param  {Response}  res  the response object.
   * @param  {Function} next the next middleware.
   */
  getAll: function(req, res, next) {
    User.find({}, function(err, users) {
      if (err) {
        return next(new Error("Failed to load Users"));
      }
      
      res.json(users);
    });
  }

};

module.exports = UserApi;