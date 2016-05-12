"use strict";

/**
 * Item structure in store:
 * 	{
 * 		...
 * 		id: {
 * 			count: Number,
 * 			item: { // mongoose model
 * 				_id: ObjectId,
 * 				feature: {
 * 					price: Number,
 * 					...
 * 				}
 * 				...
 * 			}
 * 		}
 * 		...
 * 	}
 * 	
 * Test cases:
 * 	1. Adds an item to cart
 * 	2. Removes same item just added
 * 	3. Adds an item 2 to 5 times
 * 	4. Sets item count to 2 to 5 and removes it by set item count to 0
 * 	5. Adds 2 to 5 items, each for 2 to 5 times
 * 	6. Clears items using clear cart
 */
jest.mock("../../dispatcher/AppDispatcher");

import ShoppingCartConstants from "../../constants/ShoppingCartConstants"
import ShoppingCartStore from "../ShoppingCartStore"
import AppDispatcher from "../../dispatcher/AppDispatcher"
import Mock from "mock-data"

describe("ShoppingCartStore", function() {
  
  let callback = AppDispatcher.register.mock.calls[0][0]
  ,   mockId = Mock.string(24, 24, "#a")
  ,   mockCount = Mock.integer(2, 5);
  
  beforeEach(function() {
  });

  it("registers a callback with the dispatcher", function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });
  
  it("should initialize with no items", function() {
    let items = ShoppingCartStore.getItems();
    expect(items).toEqual({});
  });
  
  it("Adds an item to cart", function() {
    let actionAddToCart = {
      action: {
        actionType: ShoppingCartConstants.ADD_TO_CART,
        item: {
          _id: "5719076ab5e5032c2264ff5c", 
          info: {}
        }
      }
    };
    callback(actionAddToCart);
    
    let items = ShoppingCartStore.getItems();
    let keys = Object.keys(items);
    
    expect(keys.length).toBe(1);
    expect(keys[0]).toEqual("5719076ab5e5032c2264ff5c");
    expect(items[keys[0]].count).toEqual(1);
  });
  
  it("Removes same item just added", function() {
  
    let items = ShoppingCartStore.getItems();
    let keys = Object.keys(items);
    expect(keys.length).toBe(1);
    
    let actionRemoveFromCart = {
      action: {
        actionType: ShoppingCartConstants.REMOVE_FROM_CART,
        id: keys[0]
      }
    };
    callback(actionRemoveFromCart);
    
    expect(items[keys[0]]).toBeUndefined();
  });
  
  it("Adds an item 2 to 5 times", function() {
    let itemId = mockId.generate();
    let actionAddToCart = {
      action: {
        actionType: ShoppingCartConstants.ADD_TO_CART,
        item: {
          _id: itemId, 
          info: {}
        }
      }
    };
    
    let itemCount = mockCount.generate();
    
    for (let i = 0; i < itemCount; i++)
    {
      callback(actionAddToCart);
    }
    
    let items = ShoppingCartStore.getItems();
    let keys = Object.keys(items);
    
    expect(keys.length).toBe(1);
    expect(keys[0]).toEqual(itemId);
    expect(items[keys[0]].count).toEqual(itemCount);
  });
  
  it("Sets item count to 10 and removes it by set item count to 0", function() {
    let items = ShoppingCartStore.getItems();
    let keys = Object.keys(items);
    
    expect(keys.length).toBe(1);
    
    let itemId = keys[0]
    ,   itemCount = mockCount.generate();
    
    let actionSetItemCount = {
      action: {
        actionType: ShoppingCartConstants.SET_ITEM_COUNT,
        id: itemId,
        count: itemCount
      }
    };
    callback(actionSetItemCount);
    
    items = ShoppingCartStore.getItems();
    expect(items[itemId].count).toEqual(itemCount);
    
    actionSetItemCount = {
      action: {
        actionType: ShoppingCartConstants.SET_ITEM_COUNT,
        id: itemId,
        count: 0
      }
    };
    callback(actionSetItemCount);
    
    items = ShoppingCartStore.getItems();
    keys = Object.keys(items);
    
    expect(keys.length).toBe(0);
  });
  
  it("Adds 2 to 5 items, each for 2 to 5 times", function() {
    let itemsCount = mockCount.generate()
    ,   countForItem = {};
    
    for (let i = 0; i < itemsCount; i++)
    {
      countForItem[mockId.generate()] = mockCount.generate();
    }
    
    for (let key of Object.keys(countForItem))
    {
      let count = countForItem[key];
      let actionAddToCart = {
        action: {
          actionType: ShoppingCartConstants.ADD_TO_CART,
          item: {
            _id: key, 
            info: {}
          }
        }
      };
      
      for (let i = 0; i < count; i++)
      {
        callback(actionAddToCart);
      }
    }
    
    let items = ShoppingCartStore.getItems();
    let keys = Object.keys(items);
    
    expect(keys.length).toBe(itemsCount);
    for (let key of keys)
    {
      expect(countForItem[key]).not.toBeUndefined();
      expect(items[key].count).toEqual(countForItem[key]);
    }
  });
  
  it("Clears items using clear cart", function() {
    let items = ShoppingCartStore.getItems();
    let keys = Object.keys(items);
    
    expect(keys.length).not.toBe(0);
    
    let actionClearCart = {
      action: {
        actionType: ShoppingCartConstants.CLEAR_CART
      }
    };
    callback(actionClearCart);
    
    items = ShoppingCartStore.getItems();
    keys = Object.keys(items);
    
    expect(keys.length).toBe(0);
  });

});