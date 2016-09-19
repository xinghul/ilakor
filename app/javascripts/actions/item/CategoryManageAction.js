import request from "superagent-bluebird-promise";
import _ from "lodash";
import invariant from "invariant";
import Promise from "bluebird";

import AppDispatcher from "dispatcher/AppDispatcher";
import CategoryManageConstants from "constants/item/CategoryManageConstants";

let CategoryManageAction = {
  
  /**
   * Adds a new category with given name.
   *
   * @param {String} name the name for the category.
   * 
   * @return {Promise} the promise object.
   */
  addCategory: function(name) {
    
    invariant(_.isString(name), `addCategory(name) expects 'name' as 'string', but gets '${typeof name}'.`);
    
    return new Promise((resolve, reject) => {

      let category = {
        name: name
      };
      
      request.post("/api/categories")
        .send({ data: JSON.stringify(category) })
        .then((res) => {
          let brandAdded = res.body;
          
          invariant(_.isObject(brandAdded), `addCategory(name) expects response.body to be 'object', but gets '${typeof brandAdded}'.`);
          
          AppDispatcher.handleAction({
            actionType: CategoryManageConstants.RECEIVED_CATEGORY,
            category: brandAdded
          });
          
          resolve();
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `addCategory(name) expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(message);
        });

    });
  },
  
  /**
   * Gets all the categories.
   *
   * @param {Boolean} setIsLoading whether to set the isLoading flag.
   * 
   * @return {Promise} the promise object.
   */
  getCategories: function(setIsLoading) {
    
    if (setIsLoading) {
      // mark as loading
      AppDispatcher.handleAction({
        actionType: CategoryManageConstants.SETS_IS_LOADING,
        isLoading: true
      });
    }    
    
    return new Promise((resolve, reject) => {
      
      request.get("/api/categories")
        .then((res) => {
          let categories = res.body;
          
          invariant(_.isArray(categories), `getCategories() expects response.body to be an array, but gets '${typeof categories}'.`);
          
          AppDispatcher.handleAction({
            actionType: CategoryManageConstants.RECEIVED_CATEGORIES,
            categories: categories
          });
          
          resolve();
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `getOrders() expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(message);
        })
        .finally(() => {
          
          if (setIsLoading) {            
            AppDispatcher.handleAction({
              actionType: CategoryManageConstants.SETS_IS_LOADING,
              isLoading: false
            });
          }
          
        });

    });
  },
  
  /**
   * Removes category specified by given id.
   *
   * @param  {String} id the id for this category.
   *
   * @return {Promise}
   */
  removeCategory: function(id) {
    
    invariant(_.isString(id), `removeCategory(id) expects 'id' to be 'string', but gets '${typeof id}'.`);
    
    return new Promise((resolve, reject) => {
      
      request.del("/api/categories")
        .query({ id: id })
        .then((res) => {
          
          AppDispatcher.handleAction({
            actionType: CategoryManageConstants.RECEIVED_REMOVED_CATEGORY_ID,
            id: id
          });
          
          resolve();
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `removeCategory(id) expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(message);
        });
      
    });
  }

};

export default CategoryManageAction;
