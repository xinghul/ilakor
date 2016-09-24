import _ from "lodash";
import invariant from "invariant";
import { EventEmitter } from "events";

import AppDispatcher from "dispatcher/AppDispatcher";
import ShoppingCartConstants from "constants/ShoppingCartConstants";

const CHANGE_EVENT = "change"
,     STORE_NAME   = "iLakor.cart";

/**
 * Returns the mock storage.
 * 
 * @return {Object} the mock storage object.
 */
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

/**
 * Checks if the storage type is available on current browser.
 * 
 * @param  {String} type the storage type.
 *
 * @return {Boolean}
 */
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

// use mock localStorage if it's not available.
if (!storageAvailable("localStorage")) {
  window["localStorage"] = storageMock();
}

// the shopping cart storage apis.
let _cartStore = {
  get: function() {
    if (!_.isEmpty(localStorage.getItem(STORE_NAME))) {
      return JSON.parse(localStorage.getItem(STORE_NAME));
    }
    
    return {};
  },
  
  save: function(itemMap) {
    localStorage.setItem(STORE_NAME, JSON.stringify(itemMap));
  },
  
  clear: function() {
    localStorage.removeItem(STORE_NAME);
  }
};

/**
 * Returns the total price for itemMap in the cart.
 * 
 * @param  {Object} itemMap the itemMap in the cart.
 * 
 * @return {Number}
 */
function getTotalPrice(itemMap) {
  invariant(_.isObject(itemMap), `getTotalPrice(itemMap) expects an 'object' as 'itemMap', but gets '${typeof itemMap}'.`);
  
  let totalPrice = 0;
  
  _.forEach(itemMap, (itemInfo) => {
    totalPrice += itemInfo.variation.price * itemInfo.count;    
  });

  return totalPrice;
}

// initialize the itemMap from local storage
let _itemMap = _cartStore.get()
,   _totalPrice = getTotalPrice(_itemMap);

let ShoppingCartStore = _.extend({}, EventEmitter.prototype, {
  
  /**
   * Adds an item with specific variation to the cart.
   * 
   * @param  {Object} itemInfo the new item with specific variation.
   */
  addToCart: function(itemInfo) {
    invariant(_.isObject(itemInfo), `addToCart(itemInfo) expects an 'object' as 'itemInfo', but gets '${typeof itemInfo}'.`);
    invariant(_.inRange(itemInfo.count, 0, 10), `addToCart(itemInfo) expects itemInfo.count to be in range of [0, 9], but gets '${itemInfo.count}'.`);
    invariant(_.isObject(itemInfo.item), `addToCart(itemInfo) expects an 'object' as 'itemInfo.item', but gets '${typeof itemInfo.item}'.`);
    invariant(_.isObject(itemInfo.variation), `addToCart(itemInfo) expects an 'object' as 'itemInfo.variation', but gets '${typeof itemInfo.variation}'.`);
    
    // concat item id and variation id as the key
    let key = itemInfo.variation._id;
    
    if (_itemMap[key]) {
      _itemMap[key].count += itemInfo.count;
    } else {
      _itemMap[key] = {
        count: itemInfo.count,
        item: itemInfo.item,
        variation: itemInfo.variation
      }
    }

    _cartStore.save(_itemMap);
  },
  
  /**
   * Removes one specific item from store.
   * 
   * @param  {String} id the id for that item.
   */
  removeFromCart: function(id) {
    invariant(_.isString(id), `removeFromCart(id) expects a 'string' as 'id', but gets '${typeof id}'.`);
    invariant(!_.isEmpty(_itemMap[id]), `Item specified by id ${id} does not exist in store.`);
    
    _itemMap[id].count--;
    
    if (_itemMap[id].count === 0) {
      delete _itemMap[id];
    }
    
    _cartStore.save(_itemMap);
  },
  
  /**
   * Sets the count for specific item.
   * 
   * @param  {String} id    the id for the item.
   * @param  {Number} count the new count.
   */
  setItemCount: function(id, count) {
    invariant(_.isString(id), `setItemCount(id, count) expects 'id' to be a 'string', but gets '${typeof id}'.`);
    invariant(_.inRange(count, 0, 10), `setItemCount(id, count) expects 'count' in range of 0 to 9, but gets '${count}'.`);    
    invariant(!_.isEmpty(_itemMap[id]), `Item specified by id ${id} does not exist in store.`);
    
    if (count === 0) {
      delete _itemMap[id];
    } else {
      _itemMap[id].count = count;      
    }
    
    _cartStore.save(_itemMap);
  },
  
  /**
   * Clears the cart.
   */
  clearCart: function() {
    _itemMap = {};
    
    _cartStore.save(_itemMap);
  },
  
  /**
   * Returns the itemMap.
   * 
   * @return {Object}
   */
  getItems: function() {
    return _.values(_itemMap);
  },
  
  /**
   * Returns the total price.
   * 
   * @return {Number}
   */
  getTotalPrice: function() {
    return _totalPrice;
  },
  
  /**
   * Sets the total price.
   * 
   * @param  {Number} totalPrice the new total price.
   */
  setTotalPrice: function(totalPrice) {
    invariant(_.isNumber(totalPrice), `setTotalPrice(totalPrice) expects a 'number' as 'totalPrice', but gets '${typeof totalPrice}'.`);
    
    _totalPrice = totalPrice;
  },

  /**
   * Emits the 'change' event.
   */
  emitChange: function() {
    // all cart operations changes the total price
    // it's more efficient to sets the total price here
    this.setTotalPrice(getTotalPrice(_itemMap));
    
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

ShoppingCartStore.dispatchToken = AppDispatcher.register((payload) => {
  const { action } = payload;

  switch(action.actionType) {
    case ShoppingCartConstants.ADD_TO_CART:
      ShoppingCartStore.addToCart(action.item);
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
