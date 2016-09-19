import _ from "lodash";
import invariant from "invariant";
import { EventEmitter } from "events";

import AppDispatcher from "dispatcher/AppDispatcher";
import ItemManageConstants from "constants/item/ItemManageConstants";

const CHANGE_EVENT = "change";

// items and tags in this store
let _items = []
,   _isLoading = false;

let ItemManageStore = _.extend({}, EventEmitter.prototype, {
  
  /**
   * Sets the items.
   * 
   * @param  {Array} newItems the new items.
   */
  setItems: function(newItems) {
    invariant(_.isArray(newItems), `setItems(newItems) expects an 'array' as 'newItems', but gets '${typeof newItems}'.`);
    
    _items = newItems;
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
   * Adds a new item to the front of the list.
   * 
   * @param  {Object} newItem the new item.
   */
  addItem: function(newItem) {
    invariant(_.isObject(newItem), `addItem(newItem) expects an 'object' as 'newItem', but gets '${typeof newItem}'.`);

    _items.unshift(newItem);
  },
  
  /**
   * Removes the item by id.
   * 
   * @param  {String} id the id for the item.
   */
  removeItem: function(id) {
    invariant(_.isString(id), `removeItem(id) expects a 'string' as 'id', but gets '${typeof id}'.`);
    
    for (let index = 0; index < _items.length; index++)
    {
      if (_items[index]._id === id)
      {
        _items.splice(index, 1);
        
        break;
      }
    }
  },
  
  /**
   * Updates a specific item with new config.
   * 
   * @param  {Object} newItem the new item config.
   */
  updateItem: function(newItem) {
    invariant(_.isObject(newItem), `updateItem(newItem) expects an 'object' as 'newItem', but gets '${typeof newItem}'.`);
    
    let id = newItem._id;
    
    for (let index = 0; index < _items.length; index++)
    {
      if (_items[index]._id === id)
      {
        _items[index] = newItem;
        
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

ItemManageStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    case ItemManageConstants.RECEIVED_ITEMS_RESET:
      ItemManageStore.setItems(action.items);
      ItemManageStore.emitChange();
      break;
    
    case ItemManageConstants.RECEIVED_ITEM:
      ItemManageStore.addItem(action.item);
      ItemManageStore.emitChange();
      break;
      
    case ItemManageConstants.RECEIVED_REMOVED_ITEM_ID:
      ItemManageStore.removeItem(action.id);
      ItemManageStore.emitChange();
      break;
      
    case ItemManageConstants.RECEIVED_UPDATED_ITEM:
      ItemManageStore.updateItem(action.item);
      ItemManageStore.emitChange();
      
    case ItemManageConstants.SETS_IS_LOADING:
      ItemManageStore.setIsLoading(action.isLoading);
      ItemManageStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default ItemManageStore;
