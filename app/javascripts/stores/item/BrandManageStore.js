import _ from "lodash";
import invariant from "invariant";
import { EventEmitter } from "events";

import AppDispatcher from "dispatcher/AppDispatcher";
import BrandManageConstants from "constants/item/BrandManageConstants";

const CHANGE_EVENT = "change";

let _brands = []
,   _isLoading = false;

let BrandManageStore = _.extend({}, EventEmitter.prototype, {
  
  /**
   * Sets the brands.
   * 
   * @param  {Array} newBrands the new brands.
   */
  setBrands: function(newBrands) {
    invariant(_.isArray(newBrands), `setBrands(newBrands) expects an 'array' as 'newBrands', but gets '${typeof newBrands}'.`);
    
    _brands = newBrands;
  },

  /**
   * Returns the brands.
   *
   * @return {Array}
   */
  getBrands: function() {
    return _brands;
  },
  
  /**
   * Adds a new brand to the front of the list.
   * 
   * @param  {Object} newBrand the new brand.
   */
  addBrand: function(newBrand) {
    invariant(_.isObject(newBrand), `addBrand(newBrand) expects an 'object' as 'newBrand', but gets '${typeof newBrand}'.`);

    _brands.unshift(newBrand);
  },
  
  /**
   * Removes the brand by id.
   * 
   * @param  {String} id the id for the brand.
   */
  removeBrand: function(id) {
    invariant(_.isString(id), `removeBrand(id) expects a 'string' as 'id', but gets '${typeof id}'.`);
    
    for (let index = 0; index < _brands.length; index++)
    {
      if (_brands[index]._id === id)
      {
        _brands.splice(index, 1);
        
        break;
      }
    }
  },
  
  /**
   * Sets the isLoading flag.
   * 
   * @param  {Boolean} isLoading the new isLoading value.
   */
  setIsLoading: function(isLoading) {
    invariant(_.isBoolean(isLoading), `setIsLoading(isLoading) expects a 'boolean' as 'isLoading', but gets '${typeof isLoading}'.`);
    
    invariant(_isLoading !== isLoading, `setIsLoading(isLoading) can't be called with same value.`);
    
    _isLoading = isLoading;
  },

  /**
   * Returns the isLoading flag.
   * 
   * @return {Boolean}
   */
  getIsLoading: function() {
    return _isLoading;
  },  
  
  /**
   * Emits the 'change' event.
   */
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * Subscribes a callback to the 'change' event.
   * 
   * @param  {Function} callback the callback to add.
   */
  subscribe: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * Unsubscribes a callback from the 'change' event.
   * 
   * @param  {Function} callback the callback to remove.
   */
  unsubscribe: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

BrandManageStore.dispatchToken = AppDispatcher.register((payload) => {
  let action = payload.action;

  switch(action.actionType) {

    case BrandManageConstants.RECEIVED_BRANDS:
      BrandManageStore.setBrands(action.brands);
      BrandManageStore.emitChange();
      break;
      
    case BrandManageConstants.RECEIVED_BRAND:
      BrandManageStore.addBrand(action.brand);
      BrandManageStore.emitChange();
      break;
      
    case BrandManageConstants.RECEIVED_REMOVED_BRAND_ID:
      BrandManageStore.removeBrand(action.id);
      BrandManageStore.emitChange();
      break;
      
    case BrandManageConstants.SETS_IS_LOADING:
      BrandManageStore.setIsLoading(action.isLoading);
      BrandManageStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default BrandManageStore;