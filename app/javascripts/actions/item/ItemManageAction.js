import request from "superagent-bluebird-promise";
import _ from "lodash";
import invariant from "invariant";
import Promise from "bluebird";

import AppDispatcher from "dispatcher/AppDispatcher";
import ItemManageConstants from "constants/item/ItemManageConstants";

let ItemManageAction = {
  
  /**
   * Gets all items.
   *
   * @param {Boolean} setIsLoading whether to set the isLoading flag.
   *
   * @return {Promise}
   */
  getItems: function(setIsLoading) {
    
    if (setIsLoading) {
      // mark as loading
      AppDispatcher.handleAction({
        actionType: ItemManageConstants.SETS_IS_LOADING,
        isLoading: true
      });
    }    
    
    let sampleQuery = {
      price: {
        "$gt": 3100,
        "$lt": "3400"
      }
    };
    
    return new Promise((resolve, reject) => {
      
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
          
          reject(new Error(message));
        })
        .finally(() => {
          
          if (setIsLoading) {
            AppDispatcher.handleAction({
              actionType: ItemManageConstants.SETS_IS_LOADING,
              isLoading: false
            });
          }                    
          
        });
      
    });
  },
  
  /**
   * Adds a new item.
   * 
   * @param  {Object} newItem an object containing item info.
   *
   * @return {Promise}
   */
  addItem: function(newItem) {
    
    invariant(_.isObject(newItem), `addItem(newItem) expects 'newItem' to be 'object', but gets '${typeof newItem}'.`);
    
    return new Promise((resolve, reject) => {
      
      request.post("/api/items")
        .send({ item: JSON.stringify(newItem) })
        .then((res) => {
          let itemAdded = res.body;
          
          invariant(_.isObject(itemAdded), `addItem(newItem) expects response.body to be 'object', but gets '${typeof itemAdded}'.`);
          
          AppDispatcher.handleAction({
            actionType: ItemManageConstants.RECEIVED_ITEM,
            item: itemAdded
          });
          
          resolve();
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `addItem(newItem) expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(new Error(message));
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
    
    invariant(_.isString(id), `updateItem(id, newValue) expects 'id' to be 'string', but gets '${typeof id}'.`);
    invariant(_.isObject(newValue), `updateItem(id, newValue) expects 'newValue' to be 'object', but gets '${typeof newValue}'.`);
    
    return new Promise((resolve, reject) => {
      
      request.put("/api/items")
        .query({ id: id })
        .send({ item: JSON.stringify(newValue) })
        .then((res) => {
          let newItem = res.body;
          
          invariant(_.isObject(newItem), `updateItem(id, newValue) expects response.body to be 'object', but gets '${typeof newItem}'.`);
          
          AppDispatcher.handleAction({
            actionType: ItemManageConstants.RECEIVED_UPDATED_ITEM,
            item: newItem
          });
          
          resolve();
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `addItem(newItem) expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(new Error(message));
        });
      
    });
  },
  
  /**
   * Removes item specified by given id.
   *
   * @param  {String} id the id for this item.
   *
   * @return {Promise}
   */
  removeItem: function(id) {
    
    invariant(_.isString(id), `removeItem(id) expects 'id' to be 'string', but gets '${typeof id}'.`);
    
    return new Promise((resolve, reject) => {
      
      request.del("/api/items")
        .query({ id: id })
        .then((res) => {
          
          AppDispatcher.handleAction({
            actionType: ItemManageConstants.RECEIVED_REMOVED_ITEM_ID,
            id: id
          });
          
          resolve();
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `removeItem(id) expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(new Error(message));
        });
      
    });
  }
  
};

export default ItemManageAction;