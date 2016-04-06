"use strict";

import request from "request"
import Promise from "bluebird"

import AppDispatcher from "dispatcher/AppDispatcher"
import ItemDisplayConstants from "constants/ItemDisplayConstants"

let ItemDisplayAction = {
  
  /**
   * Gets all items.
   *
   * @return {Promise} the promise object.
   */
  getAllItems: function() {
    
    return new Promise(function(resolve, reject) {
      
      request.get({
        url: "http://localhost:3001/api/items"
      }, function(err, response) {
        if (err) {
          reject(err);
        } else {
          // make sure the response status code is 200
          if (response.statusCode === 200) {
            let items = JSON.parse(response.body);
            
            AppDispatcher.handleAction({
              actionType: ItemDisplayConstants.RECEIVED_ALL_ITEMS,
              items: items
            });
            
            resolve();
            
          } else {
            reject(JSON.parse(response.body));
          }
        }
      });
      
    });
  }
};

export default ItemDisplayAction;