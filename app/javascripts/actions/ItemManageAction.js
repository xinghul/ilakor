"use strict";

import request from "superagent-bluebird-promise"
import Promise from "bluebird"
import _ from "lodash"
import invariant from "invariant"

import AppDispatcher from "dispatcher/AppDispatcher"
import ItemManageConstants from "constants/ItemManageConstants"

let ItemManageAction = {
  
  /**
   * Gets all items.
   *
   * @return {Promise} the promise object.
   */
  getItems: function() {
    
    // mark as loading
    AppDispatcher.handleAction({
      actionType: ItemManageConstants.SETS_IS_LOADING,
      isLoading: true
    });
    
    let sampleQuery = {
      price: {
        "$gt": 3100,
        "$lt": "3400"
      }
    };
    
    return new Promise(function(resolve, reject) {
      
      request.get("/api/items")
        // .query({query: sampleQuery})
        .then((res) => {
          let items = res.body;
          
          invariant(_.isArray(items), `getItems() expects response.body to be 'array', but gets '${typeof items}'.`);
          
          AppDispatcher.handleAction({
            actionType: ItemManageConstants.RECEIVED_ITEMS_RESET,
            items: items
          });
          
          resolve();
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `getItems() expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(message);
        })
        .finally(() => {
          
          AppDispatcher.handleAction({
            actionType: ItemManageConstants.SETS_IS_LOADING,
            isLoading: false
          });
          
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
      
      request.post("/api/items")
        .send({item: JSON.stringify(newItem)})
        .then(function(res) {
          let itemAdded = res.body;
          
          AppDispatcher.handleAction({
            actionType: ItemManageConstants.RECEIVED_ITEM,
            item: itemAdded
          });
          
          resolve();
        })
        .catch(function(err) {
          reject(err);
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