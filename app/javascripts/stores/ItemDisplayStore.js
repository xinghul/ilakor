import _ from "lodash";
import invariant from "invariant";
import { EventEmitter } from "events";

import AppDispatcher from "dispatcher/AppDispatcher";
import ItemDisplayConstants from "constants/ItemDisplayConstants";

const CHANGE_EVENT = "change";

const availableFilterTypes = [
  "brand", "category", "tag"
];

// items in this store
let _items = []
,   _filters = {}
,   _filterCollapsed = false
,   _hasMoreItems = true
,   _isLoading = false;

// initialize applied filters
_.forEach(availableFilterTypes, (filterType) => {
  _filters[filterType] = [];
});

let ItemDisplayStore = _.extend({}, EventEmitter.prototype, {
  
  /**
   * Adds new items to the item list.
   * 
   * @param  {Array} items the new items.
   */
  addItems: function(items) {
    invariant(_.isArray(items), `addItems(items) expects an 'array' as 'items', but gets '${typeof items}'.`);
    
    if (items.length === 0) {
      _hasMoreItems = false;
    }
    
    _items = items;
  },
  
  /**
   * Returns the items after applying the filters.
   * 
   * @return {Array}
   */
  getItems: function() {
    let result = [];
    
    _.forEach(_items, (item) => {
      let tags = _.map(item.tags, (rawTag) => {
        return rawTag.name;
      });

      // check if tags matches
      // must contain at least one of the tags selected
      if (!_.isEmpty(_filters.tag) && _.intersection(_filters.tag, tags).length === 0) {
        return;
      }
      
      // check if brand matches
      // must be one of the selected brands
      if (!_.isEmpty(_filters.brand) && _filters.brand.indexOf(item.brand.name) === -1) {
        return;
      }
      
      // check if category matches
      // must be one of the selected categories
      if (!_.isEmpty(_filters.category) && _filters.category.indexOf(item.category.name) === -1) {
        return;
      }
      
      result.push(item);
    });
    
    return result;
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
   * Sets the filter collapsed flag.
   * 
   * @param  {Boolean} filterCollapsed whether the filter is collapsed.
   */
  setFilterCollapsed: function(filterCollapsed) {
    _filterCollapsed = filterCollapsed;
  },
  
  /**
   * Gets the filter collapsed flag.
   * 
   * @return {Boolean}
   */
  getFilterCollapsed: function() {
    return _filterCollapsed;
  },
  
  /**
   * Sets a filter.
   * 
   * @param  {Object} filter the new filter config.
   */
  setFilter: function(filter) {
    invariant(_.isObject(filter), `setFilter(filter) expects an 'object' as 'filter', but gets '${typeof filter}'.`);
    invariant(availableFilterTypes.indexOf(filter.type) !== -1, `'${filter.type}' is not one of the available filter types.`);

    _filters[filter.type] = filter.value;
  },
  
  /**
   * Adds a new filter.
   * 
   * @param  {Object} filter the new filter config.
   */
  addFilter: function(filter) {
    invariant(_.isObject(filter), `addFilter(filter) expects an 'object' as 'filter', but gets '${typeof filter}'.`);
    invariant(availableFilterTypes.indexOf(filter.type) !== -1, `'${filter.type}' is not one of the available filter types.`);
    invariant(!_.isEmpty(filter.value), "filter value can not be empty!");
    invariant(_filters[filter.type].indexOf(filter.value) === -1, `Filter value '${filter.value}' of type '${filter.type}' already applied!`);
    
    _filters[filter.type].push(filter.value);
  },
  
  /**
   * Removes a specific filter.
   * 
   * @param  {Object} filter the filter to be removed.
   */
  removeFilter: function(filter) {
    invariant(_.isObject(filter), `removeFilter(filter) expects an 'object' as 'filter', but gets '${typeof filter}'.`);
    invariant(availableFilterTypes.indexOf(filter.type) !== -1, `'${filter.type}' is not one of the available filter types.`);
    invariant(!_.isEmpty(filter.value), "filter value can not be empty!");
    invariant(_filters[filter.type].indexOf(filter.value) !== -1, `Filter value '${filter.value}' of type '${filter.type}' is not applied!`);
    
    _.pull(_filters[filter.type], filter.value);
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

ItemDisplayStore.dispatchToken = AppDispatcher.register((payload) => {
  const { action } = payload;

  switch(action.actionType) {
    case ItemDisplayConstants.RECEIVED_ITEMS:
      ItemDisplayStore.addItems(action.items);
      ItemDisplayStore.emitChange();
      break;
      
    case ItemDisplayConstants.CLEAR_ITEMS:
      ItemDisplayStore.clearItems();
      ItemDisplayStore.emitChange();
      break;
      
    case ItemDisplayConstants.SET_FILTER:
      ItemDisplayStore.setFilter(action.filter);
      ItemDisplayStore.emitChange();
      break;  
    
    case ItemDisplayConstants.ADD_FILTER:
      ItemDisplayStore.addFilter(action.filter);
      ItemDisplayStore.emitChange();
      break;  
    
    case ItemDisplayConstants.REMOVE_FILTER:
      ItemDisplayStore.removeFilter(action.filter);
      ItemDisplayStore.emitChange();
      break;  
    
    case ItemDisplayConstants.SET_FILTER_COLLAPSED:
      ItemDisplayStore.setFilterCollapsed(action.collapsed);
      ItemDisplayStore.emitChange();
      break;  
      
    case ItemDisplayConstants.SETS_IS_LOADING:
      ItemDisplayStore.setIsLoading(action.isLoading);
      ItemDisplayStore.emitChange();
      break;
      
    default:
      // do nothing
  }

});

export default ItemDisplayStore;
