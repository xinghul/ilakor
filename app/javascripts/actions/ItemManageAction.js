"use strict";

import request from "superagent-bluebird-promise"
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
      
      request.get("/api/items")
        .then(function(res) {
          let items = res.body;
          
          AppDispatcher.handleAction({
            actionType: ItemManageConstants.RECEIVED_ITEMS_RESET,
            items: items
          });
          
          resolve();
        })
        .catch(function(err) {
          reject(err);
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
        url: API_URL,
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
      
      request.put("/api/items")
        .query({id: id})
        .send({item: JSON.stringify(newValue)})
        .then(function(res) {
          let newItem = res.body;
          
          AppDispatcher.handleAction({
            actionType: ItemManageConstants.RECEIVED_UPDATED_ITEM,
            item: newItem
          });
          
          resolve();
        })
        .catch(function(err) {
          reject(err);
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
      
      request.del("/api/items")
        .query({id: id})
        .then(function(res) {
          AppDispatcher.handleAction({
            actionType: ItemManageConstants.RECEIVED_REMOVED_ITEM_ID,
            id: id
          });
          
          resolve();
        })
        .catch(function(err) {
          reject(err);
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
      
      request.get("/api/tags")
        .then(function(res) {
          let tags = res.body;
          
          AppDispatcher.handleAction({
            actionType: ItemManageConstants.RECEIVED_ALL_TAGS,
            tags: tags
          });
          
          resolve();
        })
        .catch(function(err) {
          reject(err);
        });
      
    });
  }
};

export default ItemManageAction;