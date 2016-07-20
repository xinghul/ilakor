"use strict";

import _ from "lodash"
import invariant from "invariant"
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
    invariant(_.isArray(orders), `setOrders(orders) expects 'orders' to be 'array', but gets '${typeof orders}'.`);
    
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
    invariant(_.isBoolean(isLoading), `setIsLoading(isLoading) expects 'isLoading' to be 'boolean', but gets '${typeof isLoading}'.`);
    
    invariant(_isLoading !== isLoading, `setIsLoading(isLoading) can't be called with same value.`);
    
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

  /**
   * Emits the 'change' event.
   */
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * Subscribes a callback to the 'change' event.
   * 
   * @param  {Function} callback the callback to add.
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * Unsubscribes a callback from the 'change' event.
   * 
   * @param  {Function} callback the callback to remove.
   */
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