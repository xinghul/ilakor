"use strict";

import request from "request"
import Promise from "bluebird"

import AppDispatcher from "dispatcher/AppDispatcher"
import ItemDisplayConstants from "constants/ItemDisplayConstants"

const LOAD_SIZE = 20
,     API_URL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/items`;


let _skip = 0;

let ItemDisplayAction = {
  
  /**
   * Gets items with given skip and limit number.
   *
   * @return {Promise} the promise object.
   */
  getItems: function() {
    
    let skip = _skip
    ,   limit = LOAD_SIZE;
    
    return new Promise(function(resolve, reject) {
      request.get({
        url: API_URL,
        qs: {
          skip: skip,
          limit: limit
        }
      }, function(err, response) {
        if (err) {
          reject(err);
        } else {
          // make sure the response status code is 200
          if (response.statusCode === 200) {
            let items = JSON.parse(response.body);
            
            AppDispatcher.handleAction({
              actionType: ItemDisplayConstants.RECEIVED_ITEMS,
              items: items
            });
            
            _skip += items.length;
            
            resolve(); 
                       
          } else {
            reject(JSON.parse(response.body));
          }
        }
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
  }
};

export default ItemDisplayAction;