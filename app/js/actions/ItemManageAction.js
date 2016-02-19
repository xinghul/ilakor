"use strict";

import AppDispatcher from "../dispatcher/AppDispatcher"
import ItemManageConstants from "../constants/ItemManageConstants"

let request = require("request")
,   Promise = require("bluebird");

let ItemManageAction = {
  
  /**
   * Gets all items.
   *
   * @return {Promise} the promise object.
   */
  getAllItems: function() {
    
    let deferred = Promise.defer();
    
    request.get({
      url: "http://localhost:3001/api/items"
    }, function(err, response) {
      if (err) {
        deferred.reject(err);
      } else {
        // make sure the response status code is 200
        if (response.statusCode === 200) {
          let items = JSON.parse(response.body);
          
          AppDispatcher.handleAction({
            actionType: ItemManageConstants.RECEIVED_ALL_ITEMS,
            items: items
          });
          
          deferred.resolve();
          
        } else {
          deferred.reject(JSON.parse(response.body));
        }
      }
    });
    
    return deferred.promise;
  },
  
  /**
   * Adds a new item.
   * 
   * @param  {Object} newItem an object containing item info.
   *
   * @return {Promise} the promise object.
   */
  addItem: function(newItem) {
    
    let deferred = Promise.defer();
    
    request.post({
      url: "http://localhost:3001/api/items",
      form: {
        item: JSON.stringify(newItem)
      }
    }, function(err, response, body) {
      if (err) {
        deferred.reject(err);
      } else {
        // make sure the response status code is 200
        if (response.statusCode === 200) {
          let newItem = JSON.parse(body);
          
          AppDispatcher.handleAction({
            actionType: ItemManageConstants.RECEIVED_ITEM,
            item: newItem
          });
          
          deferred.resolve();
          
        } else {
          deferred.reject(JSON.parse(response.body));
        }
      }
    });
    
    return deferred.promise;
  },
  
  /**
   * Updates an item with new values.
   *
   * @param  {String} id the id for this item.
   * @param  {Object} newValue an object containing new item info.
   *
   * @return {Promise} the promise object.
   */
  updateItem: function(id, newValue) {
    
    let deferred = Promise.defer();
    
    request.put({
      url: "http://localhost:3001/api/items",
      qs: {
        id: id
      },
      form: {
        item: JSON.stringify(newValue)
      }
    }, function(err, response, body) {
      if (err) {
        deferred.reject(err);
      } else {
        // make sure the response status code is 200
        if (response.statusCode === 200) {
          let newItem = JSON.parse(body);
          
          AppDispatcher.handleAction({
            actionType: ItemManageConstants.RECEIVED_UPDATED_ITEM,
            item: newItem
          });
          
          deferred.resolve();
          
        } else {
          deferred.reject(JSON.parse(response.body));
        }
      }
    });
    
    return deferred.promise;
  },
  
  /**
   * Removes item specified by given id.
   *
   * @param  {String} id the id for this item.
   *
   * @return {Promise} the promise object.
   */
  removeItem: function(id) {
    
    let deferred = Promise.defer();
    
    request.del({
      url: "http://localhost:3001/api/items",
      qs: {
        id: id
      }
    }, function(err, response, body) {
      if (err) {
        deferred.reject(err);
      } else {
        // make sure the response status code is 200
        if (response.statusCode === 200) {
          
          AppDispatcher.handleAction({
            actionType: ItemManageConstants.RECEIVED_REMOVED_ITEM_ID,
            id: id
          });
          
          deferred.resolve();
          
        } else {
          deferred.reject(JSON.parse(response.body));
        }
      }
    });
    
    return deferred.promise;
  }
};

export default ItemManageAction;