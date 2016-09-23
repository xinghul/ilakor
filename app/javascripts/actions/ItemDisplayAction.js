"use strict";

import request from "superagent-bluebird-promise"
import invariant from "invariant"
import _ from "lodash"
import Promise from "bluebird"

import AppDispatcher from "dispatcher/AppDispatcher"
import ItemDisplayConstants from "constants/ItemDisplayConstants"

const LOAD_SIZE = 20;

let _skip = 0;

Promise.config({cancellation: true});

let ItemDisplayAction = {
  
  /**
   * Gets items with given skip and limit.
   *
   * @return {Promise}
   */
  getItems: function() {
    
    let skip = _skip
    ,   limit = LOAD_SIZE;
    
    return new Promise((resolve, reject, onCancel) => {
      
      let _request = request.get("/api/items")
        .query({
          skip: skip, 
          limit: limit
        })
        .then((res) => {
          let items = res.body;
          
          invariant(_.isArray(items), `getItems() expects response.body to be 'array', but gets '${typeof items}'.`);
          
          AppDispatcher.handleAction({
            actionType: ItemDisplayConstants.RECEIVED_ITEMS,
            items: items
          });
          
          _skip += items.length;
          
          resolve(); 
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `logIn(user) expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(new Error(message));
        });
      
      onCancel(() => {
        _request.cancel();
      });
    });
  },
  
  /**
   * Clears the items.
   * 
   * @return {Promise}
   */
  clearItems: function() {
    
    return new Promise((resolve, reject) => {
      
      AppDispatcher.handleAction({
        actionType: ItemDisplayConstants.CLEAR_ITEMS
      });
      
      // reset the skip
      _skip = 0;
      
      resolve();
      
    });
  },
  
  /**
   * Removes a filter.
   * 
   * @param  {String} filterType  the filter type to remove.
   * 
   * @return {Promise}
   */
  removeFilter: function(filterType) {
    
    invariant(_.isString(filterType), `removeFilter(filterType) expects filterType to be 'string', but gets '${typeof filterType}'.`);
    
    return new Promise((resolve, reject) => {
      
      AppDispatcher.handleAction({
        actionType: ItemDisplayConstants.REMOVE_FILTER,
        filterType: filterType
      });
      
      resolve();
      
    });
  }
};

export default ItemDisplayAction;