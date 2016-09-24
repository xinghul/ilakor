import _ from "lodash";
import invariant from "invariant";
import { EventEmitter } from "events";

import AppDispatcher from "dispatcher/AppDispatcher";
import CategoryManageConstants from "constants/item/CategoryManageConstants";

const CHANGE_EVENT = "change";

let _categories = []
,   _isLoading = false;

let CategoryManageStore = _.extend({}, EventEmitter.prototype, {
  
  /**
   * Sets the categories.
   * 
   * @param  {Array} newCategories the new categories.
   */
  setCategories: function(newCategories) {
    invariant(_.isArray(newCategories), `setCategories(newCategories) expects an 'array' as 'newCategories', but gets '${typeof newCategories}'.`);
    
    _categories = newCategories;
  },

  /**
   * Returns the categories.
   *
   * @return {Array}
   */
  getCategories: function() {
    return _categories;
  },
  
  /**
   * Adds a new category to the front of the list.
   * 
   * @param  {Object} newCategory the new category.
   */
  addCategory: function(newCategory) {
    invariant(_.isObject(newCategory), `addCategory(newCategory) expects an 'object' as 'newCategory', but gets '${typeof newCategory}'.`);

    _categories.unshift(newCategory);
  },
  
  /**
   * Removes the category by id.
   * 
   * @param  {String} id the id for the category.
   */
  removeCategory: function(id) {
    invariant(_.isString(id), `removeCategory(id) expects a 'string' as 'id', but gets '${typeof id}'.`);
    
    for (let index = 0; index < _categories.length; index++)
    {
      if (_categories[index]._id === id)
      {
        _categories.splice(index, 1);
        
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

CategoryManageStore.dispatchToken = AppDispatcher.register((payload) => {
  let action = payload.action;

  switch(action.actionType) {

    case CategoryManageConstants.RECEIVED_CATEGORIES:
      CategoryManageStore.setCategories(action.categories);
      CategoryManageStore.emitChange();
      break;
      
    case CategoryManageConstants.RECEIVED_CATEGORY:
      CategoryManageStore.addCategory(action.category);
      CategoryManageStore.emitChange();
      break;
      
    case CategoryManageConstants.RECEIVED_REMOVED_CATEGORY_ID:
      CategoryManageStore.removeCategory(action.id);
      CategoryManageStore.emitChange();
      break;
      
    case CategoryManageConstants.SETS_IS_LOADING:
      CategoryManageStore.setIsLoading(action.isLoading);
      CategoryManageStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default CategoryManageStore;