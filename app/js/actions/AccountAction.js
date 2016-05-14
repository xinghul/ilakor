"use strict";

import request from "request"
import Promise from "bluebird"

import AppDispatcher from "dispatcher/AppDispatcher"

const API_URL = `${window.location.hostname}:${window.location.port}/auth/facebook`;

let AccountActions = {
  
  connectFacebook: function(user) {
    
    return new Promise(function(resolve, reject) {
      
      request.get({
        url: API_URL
      }, function(err, res) {
        if (err) {
          reject(err);
        } else {
          if (res.statusCode === 200) {
            let response = JSON.parse(res.body)
            ,   newUser  = response.user;
            
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
  }

};

export default AccountActions;
