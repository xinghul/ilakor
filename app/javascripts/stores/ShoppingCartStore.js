"use strict";

import _ from "lodash"
import { EventEmitter } from "events"

import AppDispatcher from "../dispatcher/AppDispatcher"
import ShoppingCartConstants from "../constants/ShoppingCartConstants"

const CHANGE_EVENT = "change"
,     STORE_NAME   = "Cromford.cart";


function storageMock() {
  let storage = {};

  return {
    setItem: function(key, value) {
      storage[key] = value || '';
    },
    getItem: function(key) {
      return storage[key] || null;
    },
    removeItem: function(key) {
      delete storage[key];
    }
  };
}

function storageAvailable(type) {
	try {
		let storage = window[type]
    ,   x = "__storage_test__";
    
		storage.setItem(x, x);
		storage.removeItem(x);
    
		return true;
	}
	catch(e) {
		return false;
	}
}

if (!storageAvailable('localStorage')) {
  window['localStorage'] = storageMock();
}

let _cartStore = {
  get: function() {
    if (!_.isEmpty(localStorage.getItem(STORE_NAME))) {
      return JSON.parse(localStorage.getItem(STORE_NAME));
    }
    
    return {};
  },
  
  save: function(items) {
    localStorage.setItem(STORE_NAME, JSON.stringify(items));
  },
  
  clear: function() {
    localStorage.removeItem(STORE_NAME);
  }
};

function getTotalPrice(items) {
  let totalPrice = 0;
  
  for (let key of Object.keys(items))
  {
    totalPrice += items[key].item.price * items[key].count;
  }
  
  return totalPrice;
}

// initialize the items from local storage
let _items = _cartStore.get()
,   _totlePrice = getTotalPrice(_items);

let ShoppingCartStore = _.extend({}, EventEmitter.prototype, {
  
  addToCart: function(item) {
    if (_items[item._id]) {
      _items[item._id].count++;
    } else {
      _items[item._id] = {
        count: 1,
        item: item
      }
    }
    
    _cartStore.save(_items);
  },
  
  removeFromCart: function(id) {
    if (_items[id]) {
      _items[id].count--;
      
      if (_items[id].count === 0) {
        delete _items[id];
      }
    } else {
      throw new Error("Item specified by id " + id + " does not exists in store.");
    }
    
    _cartStore.save(_items);
  },
  
  setItemCount: function(id, count) {
    if (count < 0 || count > 9) {
      throw new Error("Specified count is invalid: " + count);
    }
    
    if (!_items[id]) {
      throw new Error("Item specified by id " + id + " does not exists in store.");
    }
    
    if (count === 0) {
      delete _items[id];
    } else {
      _items[id].count = count;      
    }
    
    _cartStore.save(_items);
  },
  
  clearCart: function() {
    _items = {};
    
    _cartStore.save(_items);
  },
  
  getItems: function() {
    return _items;
  },
  
  getTotalPrice: function() {
    return _totlePrice;
  },
  
  setTotalPrice: function(totlePrice) {
    _totlePrice = totlePrice;
  },
   
  emitChange: function() {
    this.setTotalPrice(getTotalPrice(_items));
    
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

ShoppingCartStore.dispatchToken = AppDispatcher.register(function(payload) {
  let action = payload.action;

  switch(action.actionType) {
    case ShoppingCartConstants.ADD_TO_CART:
      ShoppingCartStore.addToCart(action.item);
      ShoppingCartStore.emitChange();
      break;
      
    case ShoppingCartConstants.REMOVE_FROM_CART:
      ShoppingCartStore.removeFromCart(action.id);
      ShoppingCartStore.emitChange();
      break;
      
    case ShoppingCartConstants.SET_ITEM_COUNT:
      ShoppingCartStore.setItemCount(action.id, action.count);
      ShoppingCartStore.emitChange();
      break;
      
    case ShoppingCartConstants.CLEAR_CART:
      ShoppingCartStore.clearCart();
      ShoppingCartStore.emitChange();
      break;
      
    default:
      // do nothing
  }

});

export default ShoppingCartStore
