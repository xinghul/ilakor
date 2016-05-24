"use strict";

import _ from "underscore"
import { EventEmitter } from "events"

import AppDispatcher from "dispatcher/AppDispatcher"
import CheckoutConstants from "constants/CheckoutConstants"

const CHANGE_EVENT = "change";

let _errorMsg = null;

let CheckoutStore = _.extend({}, EventEmitter.prototype, {

  updateErrorMsg: function(errorMsg) {
    _errorMsg = errorMsg;
  },

  getErrorMsg: function() {
    return _errorMsg;
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

CheckoutStore.dispatchToken = AppDispatcher.register(function(payload) {
  let action = payload.action;

  switch(action.actionType) {

    case CheckoutConstants.RECEIVED_ERROR_MESSAGE:
      CheckoutStore.updateErrorMsg(action.error);
      CheckoutStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default CheckoutStore;