"use strict";

import _ from "underscore"
import { EventEmitter } from "events"

import AppDispatcher from "dispatcher/AppDispatcher"
import AuthConstants from "constants/AuthConstants"

const CHANGE_EVENT = "change";

let _user = {}
,   _isSignUp = true
,   _isModalOpen = false;

let AuthStore = _.extend({}, EventEmitter.prototype, {

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
  let action = payload.action;

  switch(action.actionType) {

    case AuthConstants.TOGGLE_MODE:
      AuthStore.toggleMode();
      AuthStore.emitChange();
      break;

    case AuthConstants.TOGGLE_MODAL:
      AuthStore.toggleModal();
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

export default AuthStore;