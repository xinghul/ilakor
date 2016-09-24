"use strict";

import _ from "lodash"
import invariant from "invariant"
import { EventEmitter } from "events"

import AppDispatcher from "dispatcher/AppDispatcher"
import OrderManageConstants from "constants/OrderManageConstants"

const CHANGE_EVENT = "change";

let _orders = []
,   _isLoading = false;

let OrderManageStore = _.extend({}, EventEmitter.prototype, {
  
  /**
   * Sets the orders.
   * 
   * @param  {Array} newOrders the new orders.
   */
  setOrders: function(newOrders) {
    invariant(_.isArray(newOrders), `setOrders(newOrders) expects an 'array' as 'newOrders', but gets '${typeof newOrders}'.`);
    
    _orders = newOrders;
  },

  /**
   * Returns the orders.
   *
   * @return {Array}
   */
  getOrders: function() {
    return _orders;
  },
  
  /**
   * Updates a specific order with new config.
   * 
   * @param  {Object} newOrder the new order config.
   */
  updateOrder: function(newOrder) {
    invariant(_.isObject(newOrder), `updateOrder(newOrder) expects an 'object' as 'newOrder', but gets '${typeof newOrder}'.`);
    
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
  
  /**
   * Sets the isLoading flag.
   * 
   * @param  {Boolean} isLoading the new isLoading value.
   */
  setIsLoading: function(isLoading) {
    invariant(_.isBoolean(isLoading), `setIsLoading(isLoading) expects a 'boolean' as 'isLoading', but gets '${typeof isLoading}'.`);
    
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
  subscribe: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * Unsubscribes a callback from the 'change' event.
   * 
   * @param  {Function} callback the callback to remove.
   */
  unsubscribe: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

OrderManageStore.dispatchToken = AppDispatcher.register((payload) => {
  const { action } = payload;

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