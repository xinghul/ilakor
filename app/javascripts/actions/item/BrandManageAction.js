import request from "superagent-bluebird-promise";
import _ from "lodash";
import invariant from "invariant";
import Promise from "bluebird";

import AppDispatcher from "dispatcher/AppDispatcher";
import BrandManageConstants from "constants/item/BrandManageConstants";

let BrandManageAction = {
  
  /**
   * Adds a new brand with given name.
   *
   * @param {String} name the name for the brand.
   * 
   * @return {Promise} the promise object.
   */
  addBrand: function(name) {
    
    invariant(_.isString(name), `addBrand(name) expects 'name' as 'string', but gets '${typeof name}'.`);
    
    return new Promise((resolve, reject) => {

      let brand = {
        name: name
      };
      
      request.post("/api/brands")
        .send({ data: JSON.stringify(brand) })
        .then((res) => {
          let brandAdded = res.body;
          
          invariant(_.isObject(brandAdded), `addBrand(name) expects response.body to be 'object', but gets '${typeof brandAdded}'.`);
          
          AppDispatcher.handleAction({
            actionType: BrandManageConstants.RECEIVED_BRAND,
            brand: brandAdded
          });
          
          resolve();
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `addBrand(name) expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(message);
        });

    });
  },
  
  /**
   * Gets all the brands.
   *
   * @param {Boolean} setIsLoading whether to set the isLoading flag.
   * 
   * @return {Promise} the promise object.
   */
  getBrands: function(setIsLoading) {
    
    if (setIsLoading) {
      // mark as loading
      AppDispatcher.handleAction({
        actionType: BrandManageConstants.SETS_IS_LOADING,
        isLoading: true
      });
    }
    
    return new Promise((resolve, reject) => {
      
      request.get("/api/brands")
        .then((res) => {
          let brands = res.body;
          
          invariant(_.isArray(brands), `getBrands() expects response.body to be an array, but gets '${typeof brands}'.`);
          
          AppDispatcher.handleAction({
            actionType: BrandManageConstants.RECEIVED_BRANDS,
            brands: brands
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
              actionType: BrandManageConstants.SETS_IS_LOADING,
              isLoading: false
            });
          }
          
        });

    });
  },
  
  /**
   * Removes brand specified by given id.
   *
   * @param  {String} id the id for this brand.
   *
   * @return {Promise}
   */
  removeBrand: function(id) {
    
    invariant(_.isString(id), `removeBrand(id) expects 'id' to be 'string', but gets '${typeof id}'.`);
    
    return new Promise((resolve, reject) => {
      
      request.del("/api/brands")
        .query({ id: id })
        .then((res) => {
          
          AppDispatcher.handleAction({
            actionType: BrandManageConstants.RECEIVED_REMOVED_BRAND_ID,
            id: id
          });
          
          resolve();
        })
        .catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `removeBrand(id) expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(message);
        });
      
    });
  }

};

export default BrandManageAction;
