"use strict";

import request from "request"
import ReactCookie from "react-cookie"
import Promise from "bluebird"

import AppDispatcher from "dispatcher/AppDispatcher"
import AuthConstants from "constants/AuthConstants"

const API_URL = `${window.location.hostname}:${window.location.port}/auth/`;

let AuthActions = {
  
  userLogIn: function(user) {
    
    return new Promise(function(resolve, reject) {
      
      request.post({
        url: API_URL + "session",
        form: {
          "email": user.email,
          "password": user.password
        }
      }, function(err, res) {
        if (err) {
          reject(err);
        } else {
          if (res.statusCode === 200) {
            let response = JSON.parse(res.body)
            ,   newUser  = response.user
            ,   token    = response.token;
            
            // save jwt token into the cookie
            ReactCookie.save("token", token);

            AppDispatcher.handleAction({
              actionType: AuthConstants.RECEIVED_USER,
              user: newUser
            });

            resolve();
          } else {
            reject(JSON.parse(res.body));
          }
        }
      });
      
    });
  },

  userSignUp: function(user) {
    
    return new Promise(function(resolve, reject) {
      // XXX check if all the fields are non-empty
      request.post({
        url: API_URL + "user",
        form: {
          user: JSON.stringify({
            "local.email": user.email,
            "local.username": user.username,
            "local.password": user.password
          })
        }
      }, function(err, res) {
        if (err) {
          reject(err);
        } else {
          if (res.statusCode === 200) {
            let newUser = JSON.parse(res.body);

            AppDispatcher.handleAction({
              actionType: AuthConstants.RECEIVED_USER,
              user: newUser
            });

            resolve();
          } else {
            reject(JSON.parse(res.body));
          }
        }
      });

    });
  },

  logInFromCookie: function() {
    let user = ReactCookie.load("user");

    if (user) {
      AppDispatcher.handleAction({
        actionType: AuthConstants.RECEIVED_USER,
        user: user
      });
    }
  },

  removeUserFromCookie: function() {
    
    return new Promise(function(resolve, reject) {
      
      request.del({
        url: API_URL + "session"
      }, function(err, res) {
        if (err) {
          reject(err);
        } else {
          if (res.statusCode === 200) {
            ReactCookie.remove("user");
            
            AppDispatcher.handleAction({
              actionType: AuthConstants.RECEIVED_USER,
              user: {}
            });

            resolve();
          } else {
            reject(res.body);
          }
        }
      });
      
    });
  }

};

export default AuthActions;
