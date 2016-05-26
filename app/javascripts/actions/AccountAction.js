"use strict";

import request from "superagent-bluebird-promise"
import Promise from "bluebird"

import AppDispatcher from "dispatcher/AppDispatcher"

let AccountActions = {
  
  connectFacebook: function(user) {
    
    return new Promise(function(resolve, reject) {
      
      request.get("/auth/facebook")
        .then(function(res) {
          let data = res.body
          ,   newUser = data.user;
          
          AppDispatcher.handleAction({
            actionType: AuthConstants.RECEIVED_USER,
            user: newUser
          });
      
          resolve();
        }).catch(function(err) {
          reject(err);
        });
    });
  }

};

export default AccountActions;
