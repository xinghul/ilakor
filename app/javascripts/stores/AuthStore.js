"use strict";

import _ from "lodash"
import { EventEmitter } from "events"

import AppDispatcher from "dispatcher/AppDispatcher"
import AuthConstants from "constants/AuthConstants"

const CHANGE_EVENT = "change";

let _user = {};

let AuthStore = _.extend({}, EventEmitter.prototype, {

  setUser: function(user) {
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
    
    // emit change right away
    // log in from cookie is too fast
    this.emitChange();
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

AuthStore.dispatchToken = AppDispatcher.register(function(payload) {
  let action = payload.action;

  switch(action.actionType) {

    case AuthConstants.RECEIVED_USER:
      AuthStore.setUser(action.user);
      AuthStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default AuthStore;