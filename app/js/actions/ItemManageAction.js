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
              actionType: ItemManageConstants.RECEIVED_ALL_ITEMS,
              items: items
            });
            
            resolve();
            
          } else {
            reject(JSON.parse(response.body));
          }
        }
      });
      
    });
  },
  
  /**
   * Adds a new item.
   * 
   * @param  {Object} newItem an object containing item info.
   *
   * @return {Promise} the promise object.
   */
  addItem: function(newItem) {
    
    return new Promise(function(resolve, reject) {
      
      request.post({
        url: "http://localhost:3001/api/items",
        form: {
          item: JSON.stringify(newItem)
        }
      }, function(err, response, body) {
        if (err) {
          reject(err);
        } else {
          // make sure the response status code is 200
          if (response.statusCode === 200) {
            let newItem = JSON.parse(body);
            
            AppDispatcher.handleAction({
              actionType: ItemManageConstants.RECEIVED_ITEM,
              item: newItem
            });
            
            resolve();
            
          } else {
            reject(JSON.parse(response.body));
          }
        }
      });
      
    });    
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
    
    return new Promise(function(resolve, reject) {
      
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
          reject(err);
        } else {
          // make sure the response status code is 200
          if (response.statusCode === 200) {
            let newItem = JSON.parse(body);
            
            AppDispatcher.handleAction({
              actionType: ItemManageConstants.RECEIVED_UPDATED_ITEM,
              item: newItem
            });
            
            resolve();
            
          } else {
            reject(JSON.parse(response.body));
          }
        }
      });
      
    });
  },
  
  /**
   * Removes item specified by given id.
   *
   * @param  {String} id the id for this item.
   *
   * @return {Promise} the promise object.
   */
  removeItem: function(id) {
    
    return new Promise(function(resolve, reject) {
      
      request.del({
        url: "http://localhost:3001/api/items",
        qs: {
          id: id
        }
      }, function(err, response, body) {
        if (err) {
          reject(err);
        } else {
          // make sure the response status code is 200
          if (response.statusCode === 200) {
            
            AppDispatcher.handleAction({
              actionType: ItemManageConstants.RECEIVED_REMOVED_ITEM_ID,
              id: id
            });
            
            resolve();
            
          } else {
            reject(JSON.parse(response.body));
          }
        }
      });
      
    });
  },
  
  /**
   * Gets all tags.
   *
   * @return {Promise} the promise object.
   */
  getAllTags: function() {
    
    return new Promise(function(resolve, reject) {
      
      request.get({
        url: "http://localhost:3001/api/tags"
      }, function(err, response) {
        if (err) {
          reject(err);
        } else {
          // make sure the response status code is 200
          if (response.statusCode === 200) {
            let tags = JSON.parse(response.body);
            
            AppDispatcher.handleAction({
              actionType: ItemManageConstants.RECEIVED_ALL_TAGS,
              tags: tags
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

export default ItemManageAction;