"use strict";

jest.dontMock("../ShoppingCartStore");
jest.dontMock("flux");
jest.dontMock("underscore");
jest.dontMock("fbjs/lib/keyMirror");


describe("ShoppingCartStore", function() {
  
  let ShoppingCartConstants = require("../../constants/ShoppingCartConstants").default;
  let ShoppingCartStore;
  let AppDispatcher;
  let callback;
  
  // mock actions
  let actionAddToCart = {
    action: {
      actionType: ShoppingCartConstants.ADD_TO_CART,
      item: {
        _id: "5719076ab5e5032c2264ff5c", 
        info: {}
      }
    }
  };
  
  let actionRemoveFromCart = {
    action: {
      actionType: ShoppingCartConstants.REMOVE_FROM_CART,
      id: ""
    }
  };

  beforeEach(function() {
    AppDispatcher = require("../../dispatcher/AppDispatcher").default;
    ShoppingCartStore = require("../ShoppingCartStore").default;
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it("registers a callback with the dispatcher", function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it("should initialize with no items", function() {
    let items = ShoppingCartStore.getItems();
    expect(items).toEqual({});
  });
  
  it("adds an item to cart", function() {
    callback(actionAddToCart);
    let items = ShoppingCartStore.getItems();
    let keys = Object.keys(items);
    expect(keys.length).toBe(1);
    expect(keys[0]).toEqual("5719076ab5e5032c2264ff5c");
    expect(items[keys[0]].count).toEqual(1);
  });

  it("removes an item from store", function() {
    let items = ShoppingCartStore.getItems();
    let keys = Object.keys(items);
    expect(keys.length).toBe(1);
    actionRemoveFromCart.action.id = keys[0];
    callback(actionRemoveFromCart);
    expect(items[keys[0]]).toBeUndefined();
  });

});