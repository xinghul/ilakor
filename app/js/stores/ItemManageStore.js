"use strict";

import _ from "underscore"
import { EventEmitter } from "events"

import AppDispatcher from "../dispatcher/AppDispatcher"
import ItemManageConstants from "../constants/ItemManageConstants"

const CHANGE_EVENT = "change";

// items in this store
let _items = [];

let ItemManageStore = _.extend({}, EventEmitter.prototype, {
  
  setItems: function(newItems) {
    _items = newItems;
  },
  
  getItems: function() {
    return _items;
  },
  
  addItem: function(newItem) {
    _items.unshift(newItem);
  },
  
  removeItem: function(id) {
    for (let index = 0; index < _items.length; index++)
    {
      if (_items[index]._id === id)
      {
        _items.splice(index, 1);
        
        break;
      }
    }
  },
  
  updateItem: function(newItem)
  {
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

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

ItemManageStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {

    case ItemManageConstants.RECEIVED_ALL_ITEMS:
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
      break;

    default:
      // do nothing
  }

});

export default ItemManageStore;
