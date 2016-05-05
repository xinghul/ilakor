"use strict";

import _ from "underscore"
import { EventEmitter } from "events"

import AppDispatcher from "dispatcher/AppDispatcher"
import ItemDisplayConstants from "constants/ItemDisplayConstants"

const CHANGE_EVENT = "change";

// items in this store
let _items = []
,   _filters = {}
,   _hasMoreItems = true;

let ItemDisplayStore = _.extend({}, EventEmitter.prototype, {
  
  addItems: function(newItems) {
    if (newItems.length === 0) {
      _hasMoreItems = false;
      
      return;
    }
    
    _items = _items.concat(newItems);
  },
  
  getItems: function() {
    return _items;
  },
  
  clearItems: function() {
    _items = [];
  },
  
  hasMoreItems: function() {
    return _hasMoreItems;
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

ItemDisplayStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {
    case ItemDisplayConstants.RECEIVED_ITEMS:
      ItemDisplayStore.addItems(action.items);
      ItemDisplayStore.emitChange();
      break;
      
    case ItemDisplayConstants.CLEAR_ITEMS:
      ItemDisplayStore.clearItems();
      ItemDisplayStore.emitChange();
      break;
      
    default:
      // do nothing
  }

});

export default ItemDisplayStore;