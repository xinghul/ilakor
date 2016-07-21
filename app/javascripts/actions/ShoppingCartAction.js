"use strict";

import Promise from "bluebird"
import _ from "lodash"
import invariant from "invariant"

import AppDispatcher from "dispatcher/AppDispatcher"
import ShoppingCartConstants from "constants/ShoppingCartConstants"

let ShoppingCartAction = {
  
  /**
   * Adds an item to the shopping cart.
   * 
   * @param  {Object} item the item.
   *
   * @return {Promise}
   */
  addToCart: function(item) {
    
    invariant(_.isObject(item), `addToCart(item) expects 'item' to be 'object', but gets '${typeof item}'.`);
    
    return new Promise((resolve, reject) => {
      
      AppDispatcher.handleAction({
        actionType: ShoppingCartConstants.ADD_TO_CART,
        item: item
      });
      
      resolve();
      
    });
  },
  
  /**
   * Removes an item by id from the shopping cart.
   * 
   * @param  {String} id the id of the item.
   *
   * @return {Promise}
   */
  removeFromCart: function(id) {
    
    invariant(_.isString(id), `removeFromCart(id) expects 'id' to be 'string', but gets '${typeof id}'.`);
    
    return new Promise((resolve, reject) => {
      
      AppDispatcher.handleAction({
        actionType: ShoppingCartConstants.REMOVE_FROM_CART,
        id: id
      });
      
      resolve();
      
    });
  },
  
  /**
   * Sets count for a specific item.
   * 
   * @param  {String} id the item id.
   * @param  {Number} count item count to set.
   *
   * @return {Promise}
   */
  setItemCount: function(id, count) {
    
    invariant(_.isString(id), `setItemCount(id, count) expects 'id' to be 'string', but gets '${typeof id}'.`);
    invariant(_.isNumber(count), `setItemCount(id, count) expects 'count' to be 'number', but gets '${typeof count}'.`);
    
    return new Promise((resolve, reject) => {
      
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
  clearCart: function() {
    
    return new Promise((resolve, reject) => {
      
      AppDispatcher.handleAction({
        actionType: ShoppingCartConstants.CLEAR_CART
      });
      
      resolve();
      
    });
  },
};

export default ShoppingCartAction;