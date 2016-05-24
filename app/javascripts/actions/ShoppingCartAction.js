"use strict";

import Promise from "bluebird"

import AppDispatcher from "dispatcher/AppDispatcher"
import ShoppingCartConstants from "constants/ShoppingCartConstants"

let ShoppingCartAction = {
  
  /**
   * Adds an item to the store.
   * @param  {Object} item the item.
   *
   * @return {Promise}
   */
  addToCart: function(item) {
    return new Promise(function(resolve, reject) {
      
      AppDispatcher.handleAction({
        actionType: ShoppingCartConstants.ADD_TO_CART,
        item: item
      });
      
      resolve();
      
    });
  },
  
  /**
   * Removes an item by id from the store.
   * @param  {String} id the id of the item.
   *
   * @return {Promise}
   */
  removeFromCart: function(id) {
    return new Promise(function(resolve, reject) {
      
      AppDispatcher.handleAction({
        actionType: ShoppingCartConstants.REMOVE_FROM_CART,
        id: id
      });
      
      resolve();
      
    });
  },
  
  /**
   * Sets count for a specific item.
   * @param  {String} id the item id.
   * @param  {Number} count item count to set.
   *
   * @return {Promise}
   */
  setItemCount: function(id, count) {
    return new Promise(function(resolve, reject) {
      
      AppDispatcher.handleAction({
        actionType: ShoppingCartConstants.SET_ITEM_COUNT,
        id: id,
        count: count
      });
      
      resolve();
      
    });
  },
  
  /**
   * Clears cart.
   *
   * @return {Promise}
   */
  clearCart: function(id, count) {
    return new Promise(function(resolve, reject) {
      
      AppDispatcher.handleAction({
        actionType: ShoppingCartConstants.CLEAR_CART
      });
      
      resolve();
      
    });
  },
};

export default ShoppingCartAction;