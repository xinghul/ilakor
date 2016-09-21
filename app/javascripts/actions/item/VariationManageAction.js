import request from "superagent-bluebird-promise";
import _ from "lodash";
import invariant from "invariant";
import Promise from "bluebird";

import AppDispatcher from "dispatcher/AppDispatcher";
import VariationManageConstants from "constants/item/VariationManageConstants";

let VariationManageAction = {
  
  /**
   * Adds a new variation.
   *
   * @param {Object} newVariation the config for the variation.
   * 
   * @return {Promise}
   */
  addVariation: function(newVariation) {
    
    invariant(_.isObject(newVariation), `addVariation(newVariation) expects 'newVariation' as 'object', but gets '${typeof newVariation}'.`);
    
    return new Promise((resolve, reject) => {

      request.post("/api/variations")
        .send({ data: JSON.stringify(newVariation) })
        .then((res) => {
          let variationAdded = res.body;
          
          invariant(_.isObject(variationAdded), `addVariation(variationAdded) expects response.body to be 'object', but gets '${typeof variationAdded}'.`);
          
          AppDispatcher.handleAction({
            actionType: VariationManageConstants.RECEIVED_VARIATION,
            variation: variationAdded
          });
          
          resolve();
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `addVariation(newVariation) expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(new Error(message));
        });

    });
  },
  
  /**
   * Gets variations associated with given item, if no item is specified, get all variations.
   *
   * @param {Boolean} setIsLoading whether to set the isLoading flag.
   * @param {String} item the specified item id.
   * 
   * @return {Promise}
   */
  getVariations: function(setIsLoading = false, item = '') {
    
    if (setIsLoading) {
      // mark as loading
      AppDispatcher.handleAction({
        actionType: VariationManageConstants.SETS_IS_LOADING,
        isLoading: true
      });
    }
    
    return new Promise((resolve, reject) => {
      
      request.get("/api/variations")
        .query({ item: item })
        .then((res) => {
          let variations = res.body;
          
          invariant(_.isArray(variations), `getVariations() expects response.body to be an array, but gets '${typeof variations}'.`);
          
          AppDispatcher.handleAction({
            actionType: VariationManageConstants.RECEIVED_VARIATIONS,
            variations: variations
          });
          
          resolve();
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `getOrders() expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(new Error(message));
        })
        .finally(() => {
          
          if (setIsLoading) {
            AppDispatcher.handleAction({
              actionType: VariationManageConstants.SETS_IS_LOADING,
              isLoading: false
            });
          }
          
        });

    });
  },
  
  /**
   * Removes variation specified by given id.
   *
   * @param  {String} id the id for this variation.
   *
   * @return {Promise}
   */
  removeVariation: function(id) {
    
    invariant(_.isString(id), `removeVariation(id) expects 'id' to be 'string', but gets '${typeof id}'.`);
    
    return new Promise((resolve, reject) => {
      
      request.del("/api/variations")
        .query({ id: id })
        .then((res) => {
          
          AppDispatcher.handleAction({
            actionType: VariationManageConstants.RECEIVED_REMOVED_VARIATION_ID,
            id: id
          });
          
          resolve();
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `removeVariation(id) expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(new Error(message));
        });
      
    });
  }

};

export default VariationManageAction;
