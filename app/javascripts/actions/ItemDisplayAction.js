"use strict";

import request from "superagent-bluebird-promise"
import Promise from "bluebird"

import AppDispatcher from "dispatcher/AppDispatcher"
import ItemDisplayConstants from "constants/ItemDisplayConstants"

const LOAD_SIZE = 20;

let _skip = 0;

Promise.config({cancellation: true});

let ItemDisplayAction = {
  
  /**
   * Gets items with given skip and limit number.
   *
   * @return {Promise} the promise object.
   */
  getItems: function() {
    
    let skip = _skip
    ,   limit = LOAD_SIZE;
    
    return new Promise(function(resolve, reject, onCancel) {
      let _request = request.get("/api/items")
        .query({
          skip: skip, 
          limit: limit
        })
        .then(function(res) {
          let items = res.body;
          
          AppDispatcher.handleAction({
            actionType: ItemDisplayConstants.RECEIVED_ITEMS,
            items: items
          });
          
          _skip += items.length;
          
          resolve(); 
        }).catch(function(err) {
          reject(err);
        });
      
      onCancel(() => {
        _request.cancel();
      });
    });
  },
  
  clearItems: function() {
    return new Promise(function(resolve, reject) {
      
      AppDispatcher.handleAction({
        actionType: ItemDisplayConstants.CLEAR_ITEMS
      });
      
      // reset the skip
      _skip = 0;
      
      resolve();
      
    });
  },
  
  removeFilter: function(filterType, filterValue) {
    return new Promise(function(resolve, reject) {
      
      AppDispatcher.handleAction({
        actionType: ItemDisplayConstants.REMOVE_FILTER,
        filterType: filterType,
        filterValue: filterValue
      });
      
      resolve();
      
    });
  }
};

export default ItemDisplayAction;