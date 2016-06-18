"use strict";

import _ from "lodash"
import { EventEmitter } from "events"

import AppDispatcher from "dispatcher/AppDispatcher"
import OrderManageConstants from "constants/OrderManageConstants"

const CHANGE_EVENT = "change";

let _orders = null;

let OrderManageStore = _.extend({}, EventEmitter.prototype, {

  setOrders: function(orders) {
    _orders = orders;
  },

  getOrders: function() {
    return _orders;
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

OrderManageStore.dispatchToken = AppDispatcher.register(function(payload) {
  let action = payload.action;

  switch(action.actionType) {

    case OrderManageConstants.RECEIVED_ORDERS:
      OrderManageStore.setOrders(action.orders);
      OrderManageStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default OrderManageStore;