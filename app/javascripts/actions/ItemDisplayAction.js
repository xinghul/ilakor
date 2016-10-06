import request from "superagent-bluebird-promise";
import invariant from "invariant";
import _ from "lodash";
import Promise from "bluebird";

import AppDispatcher from "dispatcher/AppDispatcher";
import ItemDisplayConstants from "constants/ItemDisplayConstants";

const LOAD_SIZE = 20;

let _skip = 0;

Promise.config({cancellation: true});

let ItemDisplayAction = {
  
  /**
   * Gets items with given skip and limit.
   *
   * @param {Boolean} setIsLoading whether to set the isLoading flag.
   *
   * @return {Promise}
   */
  getItems: function(setIsLoading) {
    
    let skip = _skip
    ,   limit = LOAD_SIZE;
    
    if (setIsLoading) {
      // mark as loading
      AppDispatcher.handleAction({
        actionType: ItemDisplayConstants.SETS_IS_LOADING,
        isLoading: true
      });
    }    
    
    return new Promise((resolve, reject, onCancel) => {
      
      let _request = request.get("/api/items")
        // .query({
        //   skip: skip, 
        //   limit: limit
        // })
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
        })
        .finally(() => {
          if (setIsLoading) {            
            
            AppDispatcher.handleAction({
              actionType: ItemDisplayConstants.SETS_IS_LOADING,
              isLoading: false
            });
          }
          
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
   * Sets a filter.
   * 
   * @param  {Object} filter  the specific filter to set.
   * 
   * @return {Promise}
   */
  setFilter: function(filter) {
    
    return new Promise((resolve, reject) => {
      
      AppDispatcher.handleAction({
        actionType: ItemDisplayConstants.SET_FILTER,
        filter: filter
      });
      
      resolve();
      
    });
  },
  
  /**
   * Adds a filter.
   * 
   * @param  {Object} filter  the specific filter to add.
   * 
   * @return {Promise}
   */
  addFilter: function(filter) {
    
    return new Promise((resolve, reject) => {
      
      AppDispatcher.handleAction({
        actionType: ItemDisplayConstants.ADD_FILTER,
        filter: filter
      });
      
      resolve();
      
    });
  },
  
  /**
   * Removes a filter.
   * 
   * @param  {Object} filter  the specific filter to remove.
   * 
   * @return {Promise}
   */
  removeFilter: function(filter) {
    
    return new Promise((resolve, reject) => {
      
      AppDispatcher.handleAction({
        actionType: ItemDisplayConstants.REMOVE_FILTER,
        filter: filter
      });
      
      resolve();
      
    });
  },
  
  /**
   * Sets the filter collapsed flag.
   * 
   * @param  {Boolean} collapsed the new filter collapsed value.
   *
   * @return {Promise}
   */
  setFilterCollapsed: function(collapsed) {
    
    return new Promise((resolve, reject) => {
      
      AppDispatcher.handleAction({
        actionType: ItemDisplayConstants.SET_FILTER_COLLAPSED,
        collapsed: collapsed
      });
      
      resolve();
      
    });
  }
};

export default ItemDisplayAction;