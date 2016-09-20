import _ from "lodash";
import invariant from "invariant";
import { EventEmitter } from "events";

import AppDispatcher from "dispatcher/AppDispatcher";
import VariationManageConstants from "constants/item/VariationManageConstants";

const CHANGE_EVENT = "change";

let _variations = []
,   _isLoading = false;

let VariationManageStore = _.extend({}, EventEmitter.prototype, {
  
  /**
   * Sets the variations.
   * 
   * @param  {Array} newVariations the new variations.
   */
  setVariations: function(newVariations) {
    invariant(_.isArray(newVariations), `setVariations(newVariations) expects an 'array' as 'newVariations', but gets '${typeof newVariations}'.`);
    
    _variations = newVariations;
  },

  /**
   * Returns the variations.
   *
   * @return {Array}
   */
  getVariations: function() {
    return _variations;
  },
  
  /**
   * Adds a new variation to the front of the list.
   * 
   * @param  {Object} newVariation the new variation.
   */
  addVariation: function(newVariation) {
    invariant(_.isObject(newVariation), `addVariation(newVariation) expects an 'object' as 'newVariation', but gets '${typeof newVariation}'.`);

    _variations.unshift(newVariation);
  },
  
  /**
   * Removes the variation by id.
   * 
   * @param  {String} id the id for the variation.
   */
  removeVariation: function(id) {
    invariant(_.isString(id), `removeVariation(id) expects a 'string' as 'id', but gets '${typeof id}'.`);
    
    for (let index = 0; index < _variations.length; index++)
    {
      if (_variations[index]._id === id)
      {
        _variations.splice(index, 1);
        
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
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * Unsubscribes a callback from the 'change' event.
   * 
   * @param  {Function} callback the callback to remove.
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

VariationManageStore.dispatchToken = AppDispatcher.register((payload) => {
  let action = payload.action;

  switch(action.actionType) {

    case VariationManageConstants.RECEIVED_VARIATIONS:
      VariationManageStore.setVariations(action.variations);
      VariationManageStore.emitChange();
      break;
      
    case VariationManageConstants.RECEIVED_VARIATION:
      VariationManageStore.addVariation(action.variation);
      VariationManageStore.emitChange();
      break;
      
    case VariationManageConstants.RECEIVED_REMOVED_VARIATION_ID:
      VariationManageStore.removeVariation(action.id);
      VariationManageStore.emitChange();
      break;
      
    case VariationManageConstants.SETS_IS_LOADING:
      VariationManageStore.setIsLoading(action.isLoading);
      VariationManageStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default VariationManageStore;