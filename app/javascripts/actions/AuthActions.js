"use strict";

import request from "superagent-bluebird-promise"
import ReactCookie from "react-cookie"
import Promise from "bluebird"

import AppDispatcher from "dispatcher/AppDispatcher"
import AuthConstants from "constants/AuthConstants"

let AuthActions = {
  
  userLogIn: function(user) {
    
    return new Promise(function(resolve, reject) {
      
      request.post("/auth/session")
        .send({email: user.email, password: user.password})
        .then(function(res) {
          let data = res.body
          ,   newUser = data.user
          ,   token = data.token;
          
          // save jwt token into the cookie
          ReactCookie.save("token", token);
          
          AppDispatcher.handleAction({
            actionType: AuthConstants.RECEIVED_USER,
            user: newUser
          });
          
          resolve();
        })
        .catch(function(err) {
          if (err.status === 422) {
            reject(err);            
          } else {
            resolve();
          }
        });
      
    });
  },

  userSignUp: function(user) {
    
    return new Promise(function(resolve, reject) {
      
      let userInfo = JSON.stringify({
        "local.email": user.email,
        "local.username": user.username,
        "local.password": user.password
      });
      
      request.post("/auth/user")
        .send({user: userInfo})
        .then(function(res) {
          let newUser = res.body;

          AppDispatcher.handleAction({
            actionType: AuthConstants.RECEIVED_USER,
            user: newUser
          });

          resolve();
        })
        .catch(function(err) {
          if (err.status === 422) {
            reject(err);            
          } else {
            resolve();
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
      
      ReactCookie.remove("user");
      
      AppDispatcher.handleAction({
        actionType: AuthConstants.RECEIVED_USER,
        user: {}
      });
      
      request.del("/auth/session").then(() => {}).catch(function(err) {
        console.log(err);
      });

      resolve();
    });
  }

};

export default AuthActions;
