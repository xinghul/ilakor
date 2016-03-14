"use strict";

import _ from "underscore"
import { EventEmitter } from "events"

import AppDispatcher from "../dispatcher/AppDispatcher"
import ItemDisplayConstants from "../constants/ItemDisplayConstants"

const CHANGE_EVENT = "change";

// items in this store
let _items = [];

let ItemDisplayStore = _.extend({}, EventEmitter.prototype, {
  
  setItems: function(newItems) {
    _items = newItems;
  },
  
  getItems: function() {
    return _items;
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

    case ItemDisplayConstants.RECEIVED_ALL_ITEMS:
      ItemDisplayStore.setItems(action.items);
      ItemDisplayStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default ItemDisplayStore;
