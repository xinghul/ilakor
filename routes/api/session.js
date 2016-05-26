"use strict";

let mongoose = require("mongoose")
,   passport = require("passport")
,   jwt      = require("jsonwebtoken");

let CustomError = require("../utils/CustomError")
,   ValidationError = require("../utils/ValidationError");

let SessionApi = {
  
  /**
   * Returns the session if logged in.
   * 
   * @param  {Request}  req  the request object.
   * @param  {Response} res  the response object.
   * @param  {Function} next the next middleware.
   *
   * @return {Object} the user info and jwt token.
   * {
   * 	'user': {Object} the user info
   * 	'token': {String} jwt token
   * }
   */
  get: function(req, res, next) {
    let token;
    
    if (req.isAuthenticated()) {
      token = jwt.sign(req.user, process.env.JWT_SECRET, {
        expiresIn: "24h"
      });

      return res.json({
        "user": req.user,
        "token": token
      });
    }
    
    return next(new CustomError(401, "You're not logged in."));
  },
  
  /**
   * Deletes the session when user log out.
   * 
   * @param  {Request}  req  the request object.
   * @param  {Response} res  the response object.
   * @param  {Function} next the next middleware.
   *
   */
  delete: function(req, res, next) {
    if (req.user) {
      req.logout();
      
      return res.sendStatus(200);
    }
    
    return next(new CustomError(400, "You're not logged in."));
  },
  
  /**
   * Creates a session. (When user logged in)
   * Using passport's local strategy.
   * 
   * @param  {Request}  req  the request object.
   * req.body:
   * {
   * 	email: {String} used as username field for the local strategy.
   * 	password: {String} password field for the local strategy
   * }
   * @param  {Response} res  the response object.
   *
   * @return {Object} the user info and jwt token.
   * {
   * 	'user': {Object} the user info
   * 	'token': {String} jwt token
   * }
   */
  create: function(req, res, next) {
    let token;
    
    passport.authenticate("local", function(err, user, validationError) {
      if (err) {
        return next(err);
      } else if (validationError) {
        return next(new ValidationError(validationError.message));
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        
        token = jwt.sign(user, process.env.JWT_SECRET, {
          expiresIn: "24h"
        });
        
        res.json({
          "user": req.user,
          "token": token
        });
      });
    })(req, res, next);
  }

};

module.exports = SessionApi;
