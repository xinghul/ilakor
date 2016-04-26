"use strict";

import request from "request"
import Promise from "bluebird"

import AppDispatcher from "dispatcher/AppDispatcher"
import ItemManageConstants from "constants/ItemManageConstants"

let ItemManageAction = {
  
  /**
   * Gets all items.
   *
   * @return {Promise} the promise object.
   */
  getItems: function() {
    
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
              actionType: ItemManageConstants.RECEIVED_ITEMS_RESET,
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
      
      let formData = new FormData();
      
      for (let image of newItem.image)
      {
        formData.append("image", image);
      }
      
      // delete the image property
      delete newItem.image;
      
      formData.append("item", JSON.stringify(newItem));
 
      var xhr = new XMLHttpRequest();
      
      xhr.open("post", "/api/items", true);
      
      xhr.onload = function () {
        if (this.status == 200) {
          let newItem = JSON.parse(this.response);
          
          AppDispatcher.handleAction({
            actionType: ItemManageConstants.RECEIVED_ITEM,
            item: newItem
          });
          
          resolve();
        } else {
          reject(this.statusText);
        }
      };
      
      xhr.send(formData);
        
      return;
      
      // enable this when request support ES6
      // https://github.com/request/request/issues/1961
      request.post({
        url: "http://localhost:3001/api/items",
        formData: newItem
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