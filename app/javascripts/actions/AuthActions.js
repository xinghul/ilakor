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
        email: user.email,
        username: user.username,
        password: user.password
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
  
  updateUserInfo: function(id, info) {
    return new Promise(function(resolve, reject) {

      request.put("/auth/user")
        .query({id: id})
        .send({user: JSON.stringify(info)})
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
  
  forgotPassword: function(email) {
    return new Promise(function(resolve, reject) {

      request.post("/auth/forgot")
        .send({email: email})
        .then(function(res) {
          let message = "A reset password link has been sent to you via email.";

          resolve(message);
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
  
  resetPassword: function(token, password) {
    return new Promise(function(resolve, reject) {

      request.post("/auth/reset")
        .query({token: token})
        .send({password: password})
        .then(function(res) {
          let message = res.body.message;

          resolve(message);
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
