"use strict";

import _ from "lodash"
import { EventEmitter } from "events"

import AppDispatcher from "dispatcher/AppDispatcher"
import AccountConstants from "constants/AccountConstants"

const CHANGE_EVENT = "change";

let _orders = []
,   _isLoading = false;

let AccountStore = _.extend({}, EventEmitter.prototype, {
  
  /**
   * Sets the orders.
   * 
   * @param  {Object[]} orders the new orders.
   */
  setOrders: function(orders) {
    _orders = orders;
  },

  /**
   * Returns the orders.
   * 
   * @return {Object[]}
   */
  getOrders: function() {
    return _orders;
  },
  
  /**
   * Sets the isLoading flag.
   * 
   * @param  {Boolean} isLoading the new isLoading value.
   */
  setIsLoading: function(isLoading) {
    _isLoading = isLoading;
  },

  /**
   * Returns the isLoading flag.
   * 
   * @return {Boolean}
   */
  getIsLoading: function() {
    return _isLoading;
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

AccountStore.dispatchToken = AppDispatcher.register(function(payload) {
  let action = payload.action;

  switch(action.actionType) {

    case AccountConstants.RECEIVED_ORDERS:
      AccountStore.setOrders(action.orders);
      AccountStore.emitChange();
      break;
      
    case AccountConstants.SETS_IS_LOADING:
      AccountStore.setIsLoading(action.isLoading);
      AccountStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default AccountStore;