"use strict";

import _ from "lodash"
import { EventEmitter } from "events"

import AppDispatcher from "dispatcher/AppDispatcher"
import OrderManageConstants from "constants/OrderManageConstants"

const CHANGE_EVENT = "change";

let _orders = []
,   _isLoading = false;

let OrderManageStore = _.extend({}, EventEmitter.prototype, {

  setOrders: function(orders) {
    _orders = orders;
  },

  getOrders: function() {
    return _orders;
  },
  
  updateOrder: function(newOrder) {
    let id = newOrder._id;
    
    for (let order of _orders)
    {
      if (order._id === id)
      {
        _orders[_orders.indexOf(order)] = newOrder;
        
        break;
      }
    }
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
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
      
    case OrderManageConstants.RECEIVED_UPDATED_ORDER:
      OrderManageStore.updateOrder(action.order);
      OrderManageStore.emitChange();
      break;
      
    case OrderManageConstants.SETS_IS_LOADING:
      OrderManageStore.setIsLoading(action.isLoading);
      OrderManageStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default OrderManageStore;