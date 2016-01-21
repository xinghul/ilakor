+function(undefined) {
"use strict";

var ReactCookie  = require("react-cookie")
,   _            = require("underscore")
,   EventEmitter = require("events").EventEmitter;

var AppDispatcher = require("../dispatcher/AppDispatcher")
,   AuthConstants = require("../constants/AuthConstants");

var CHANGE_EVENT = "change"
,   _isSignUp = true
,   _isModalOpen = false;

var _username = ""
,   _password = ""
,   _email = ""
,   _user = {};

var AuthStore = _.extend({}, EventEmitter.prototype, {

  toggleMode: function() {
    _isSignUp = !_isSignUp;
  },

  toggleModal: function() {
    _isModalOpen = !_isModalOpen;
  },

  isSignUp: function() {
    return _isSignUp;
  },

  isModalOpen: function() {
    return _isModalOpen;
  },

  getUsernameInput: function() {
    return _username;
  },

  inputUsername: function(username) {
    _username = username;
  },

  getEmailInput: function() {
    return _email;
  },

  inputEmail: function(email) {
    _email = email;
  },

  getPasswordInput: function() {
    return _password;
  },

  inputPassword: function(password) {
    _password = password;
  },

  updateUser: function(user) {
    _user = user;
  },

  getUser: function() {
    return _user;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

AuthStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {

    case AuthConstants.TOGGLE_MODE:
      AuthStore.toggleMode();
      AuthStore.emitChange();
      break;

    case AuthConstants.TOGGLE_MODAL:
      AuthStore.toggleModal();
      AuthStore.emitChange();
      break;

    case AuthConstants.INPUT_USERNAME:
      AuthStore.inputUsername(action.username);
      AuthStore.emitChange();
      break;

    case AuthConstants.INPUT_EMAIL:
      AuthStore.inputEmail(action.email);
      AuthStore.emitChange();
      break;

    case AuthConstants.INPUT_PASSWORD:
      AuthStore.inputPassword(action.password);
      AuthStore.emitChange();
      break;

    case AuthConstants.RECEIVED_USER:
      AuthStore.updateUser(action.user);
      AuthStore.emitChange();
      break;

    default:
      // do nothing
  }

});

module.exports = AuthStore;

}();
