"use strict";

import _ from "lodash"
import invariant from "invariant"
import { EventEmitter } from "events"

import AppDispatcher from "dispatcher/AppDispatcher"
import ItemDisplayConstants from "constants/ItemDisplayConstants"

const CHANGE_EVENT = "change";

// items in this store
let _items = []
,   _filters = {
  color: "red",
  location: "kitchen",
  made: "China"
}
,   _hasMoreItems = true;

let ItemDisplayStore = _.extend({}, EventEmitter.prototype, {
  
  /**
   * Adds new items to the item list.
   * 
   * @param  {Array} newItems the new items.
   */
  addItems: function(newItems) {
    invariant(_.isArray(newItems), `addItems(newItems) expects an 'array' as 'newItems', but gets '${typeof newItems}'.`);
    
    if (newItems.length === 0) {
      _hasMoreItems = false;
      
      return;
    }
    
    _items = _items.concat(newItems);
  },
  
  /**
   * Returns the items.
   * 
   * @return {Array}
   */
  getItems: function() {
    return _items;
  },
  
  /**
   * Clears the items.
   */
  clearItems: function() {
    _items = [];
  },
  
  /**
   * Returns a flag indicates if there's more items on server.
   * 
   * @return {Boolean}
   */
  hasMoreItems: function() {
    return _hasMoreItems;
  },
  
  /**
   * Adds a new filter.
   * 
   * @param  {Object} newFilter the new filter config.
   */
  addFilter: function(newFilter) {
    invariant(_.isObject(newFilter), `addFilter(newFilter) expects an 'object' as 'newFilter', but gets '${typeof newFilter}'.`);
    invariant(!_filters.hasOwnProperty(newFilter.type), `Filter type '${filterType}' is already applied!`);
    invariant(!_.isEmpty(newFilter.value), "filter value can not be empty!");
    
    _filters[newFilter.type] = newFilter.value;
  },
  
  /**
   * Removes a specific filter.
   * 
   * @param  {String} filterType the specific filte type to remove.
   */
  removeFilter: function(filterType) {
    invariant(_filters.hasOwnProperty(filterType), `Filter type '${filterType}' is not applied!`);
    
    delete _filters[filterType];
  },
  
  /**
   * Returns the applied filters.
   * 
   * @return {Object}
   */
  getFilters: function() {
    return _filters;
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

ItemDisplayStore.dispatchToken = AppDispatcher.register(function(payload) {
  let action = payload.action;

  switch(action.actionType) {
    case ItemDisplayConstants.RECEIVED_ITEMS:
      ItemDisplayStore.addItems(action.items);
      ItemDisplayStore.emitChange();
      break;
      
    case ItemDisplayConstants.CLEAR_ITEMS:
      ItemDisplayStore.clearItems();
      ItemDisplayStore.emitChange();
      break;
    
    case ItemDisplayConstants.REMOVE_FILTER:
      ItemDisplayStore.removeFilter(action.filterType);
      ItemDisplayStore.emitChange();
      break;  
      
    default:
      // do nothing
  }

});

export default ItemDisplayStore;
