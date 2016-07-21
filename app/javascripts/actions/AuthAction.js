"use strict";

import request from "superagent-bluebird-promise"
import invariant from "invariant"
import _ from "lodash"
import Promise from "bluebird"
import ReactCookie from "react-cookie"

import AppDispatcher from "dispatcher/AppDispatcher"
import AuthConstants from "constants/AuthConstants"

let AuthAction = {
  
  /**
   * Shows the modal.
   * 
   * @return {Promise} 
   */
  showModal: function() {
    
    return new Promise((resolve, reject) => {
      
      AppDispatcher.handleAction({
        actionType: AuthConstants.SET_MODAL_OPEN,
        isModalOpen: true
      });
      
      setTimeout(resolve, 300);
    });
    
  },
  
  /**
   * Hides the modal.
   * 
   * @return {Promise}
   */
  hideModal: function() {
    
    return new Promise((resolve, reject) => {
      
      AppDispatcher.handleAction({
        actionType: AuthConstants.SET_MODAL_OPEN,
        isModalOpen: false
      });
      
      setTimeout(resolve, 300);
    });
    
  },
  
  /**
   * Logs in with given user credentials.
   * 
   * @param  {Object} user the user credentials used for log in.
   * 
   * @return {Promise}     
   */
  logIn: function(user) {
    
    invariant(_.isObject(user), `logIn(user) expects 'user' to be 'object', but gets '${typeof user}'.`);
    invariant(!_.isEmpty(user.email), `Email can not be empty.`);
    invariant(!_.isEmpty(user.password), `Password can not be empty.`);
    
    return new Promise((resolve, reject) => {
      
      request.post("/auth/session")
        .send({ email: user.email, password: user.password })
        .then((res) => {
          let data = res.body
          ,   newUser = data.user
          ,   token = data.token;
          
          invariant(_.isObject(data), `logIn(user) expects response.body to be 'object', but gets '${typeof data}'.`);
          invariant(_.isObject(newUser), `logIn(user) expects response.body.user to be 'object', but gets '${typeof newUser}'.`);
          invariant(_.isString(token), `logIn(user) expects response.body.token to be 'string', but gets '${typeof token}'.`);
          
          // save jwt token into the cookie
          ReactCookie.save("token", token);
          
          AppDispatcher.handleAction({
            actionType: AuthConstants.RECEIVED_USER,
            user: newUser
          });
          
          resolve();
        })
        .catch((err) => {
          let message = err.body.message;
          
          invariant(_.isString(message), `logIn(user) expects error.body.message to be 'string', but gets '${typeof message}'.`);
          
          reject(message);
        });
      
    });
  },
  
  /**
   * Signs up with given user credentials.
   * 
   * @param  {Object} user the user credentials used for signup.
   * 
   * @return {Promise}     
   */
  signUp: function(user) {
    
    invariant(_.isObject(user), `signUp(user) expects 'user' to be 'object', but gets '${typeof user}'.`);
    invariant(!_.isEmpty(user.email), `Email can not be empty.`);
    invariant(!_.isEmpty(user.username), `Username can not be empty.`);
    invariant(!_.isEmpty(user.password), `Password can not be empty.`);
    
    return new Promise(function(resolve, reject) {
      
      request.post("/auth/user")
        .send({ user: JSON.stringify(user) })
        .then((res) => {
          let newUser = res.body;
          
          invariant(_.isObject(newUser), `signUp(user) expects response.body to be 'object', but gets '${typeof newUser}'.`);

          AppDispatcher.handleAction({
            actionType: AuthConstants.RECEIVED_USER,
            user: newUser
          });

          resolve();
        })
        .catch((err) => {
          let message = err.body.message;
          
          invariant(_.isString(message), `signUp(user) expects error.body.message to be 'string', but gets '${typeof message}'.`);
          
          reject(message);
        });

    });
  },
  
  /**
   * Updates the info for specific user.
   * 
   * @param  {String} id   the id for the user.
   * @param  {Object} info the new info.
   * 
   * @return {Promise}     
   */
  updateUserInfo: function(id, info) {
    
    invariant(_.isString(id), `updateUserInfo(id, info) expects 'id' to be 'string', but gets '${typeof id}'.`);
    invariant(_.isObject(info), `updateUserInfo(id, info) expects 'info' to be 'object', but gets '${typeof info}'.`);
    
    return new Promise((resolve, reject) => {

      request.put("/auth/user")
        .query({ id: id })
        .send({ user: JSON.stringify(info) })
        .then((res) => {
          let newUser = res.body;
          
          invariant(_.isObject(newUser), `updateUserInfo(id, info) expects response.body to be 'object', but gets '${typeof newUser}'.`);

          AppDispatcher.handleAction({
            actionType: AuthConstants.RECEIVED_USER,
            user: newUser
          });

          resolve();
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `logIn(user) expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(message);
        });

    });
  },
  
  /**
   * Sends a forgot password request.
   * 
   * @param  {String} email the email used for registeration.
   * 
   * @return {Promise}       
   */
  forgotPassword: function(email) {
    
    invariant(_.isString(email), `forgotPassword(email) expects 'email' to be 'string', but gets '${typeof email}'.`);
    
    return new Promise((resolve, reject) => {

      request.post("/auth/forgot")
        .send({ email: email })
        .then((res) => {
          let message = "A reset password link has been sent to you via email.";

          resolve(message);
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `forgotPassword(email) expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(message);
        });

    });
  },
  
  /**
   * Sends a reset password request.
   * 
   * @param  {String} token the reset password token.
   * @param  {String} password the new password.
   * 
   * @return {Promise}       
   */
  resetPassword: function(token, password) {
    
    invariant(_.isString(token), `resetPassword(token, password) expects 'token' to be 'string', but gets '${typeof token}'.`);
    invariant(_.isString(password), `resetPassword(token, password) expects 'password' to be 'string', but gets '${typeof password}'.`);
    
    return new Promise((resolve, reject) => {

      request.post("/auth/reset")
        .query({ token: token })
        .send({ password: password })
        .then((res) => {
          let message = "Password successfully updated.";

          resolve(message);
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `forgotPassword(email) expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(message);
        });

    });
  },
  
  /**
   * Logs in from cookie.
   * 
   * @return {Promise}
   */
  logInFromCookie: function() {
    let user = ReactCookie.load("user");

    if (_.isObject(user)) {
      AppDispatcher.handleAction({
        actionType: AuthConstants.RECEIVED_USER,
        user: user
      });
    }
  },
  
  /**
   * Removes the user from cookie.
   * 
   * @return {Promise}
   */
  removeUserFromCookie: function() {
    
    return new Promise((resolve, reject) => {
      
      ReactCookie.remove("user");
      
      AppDispatcher.handleAction({
        actionType: AuthConstants.RECEIVED_USER,
        user: {}
      });
      
      // make the log out instant
      // let server handle the errors
      request.del("/auth/session").then(() => {}).catch((err) => {
        console.log(err);
      });

      resolve();
    });
  }

};

export default AuthAction;
