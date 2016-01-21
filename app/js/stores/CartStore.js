(function(undefined) {
    "use strict";

    var _            = require("underscore"),
        EventEmitter = require("events").EventEmitter;

    var AppDispatcher     = require("../dispatcher/AppDispatcher"),
        FluxCartConstants = require("../constants/FluxCartConstants");

    // Define initial data points
    var CHANGE_EVENT = "change",
        _products    = {},
        _cartVisible = false;

    // Add product to cart
    function add(sku, update) {
        update.quantity = sku in _products ? _products[sku].quantity + 1 : 1;
        _products[sku] = _.extend({}, _products[sku], update);
    }

    // Set cart visibility
    function setCartVisible(cartVisible) {
        _cartVisible = cartVisible;
    }

    // Remove item from cart
    function removeItem(sku) {
        delete _products[sku];
    }

    // Extend Cart Store with EventEmitter to add eventing capabilities
    var CartStore = _.extend({}, EventEmitter.prototype, {

        // Return cart items
        getCartItems: function() {
            return _products;
        },

        // Return # of items in cart
        getCartCount: function() {
            return Object.keys(_products).length;
        },

        // Return cart cost total
        getCartTotal: function() {
            var total = 0;
            for(var product in _products){
                if(_products.hasOwnProperty(product)){
                    total += _products[product].price * _products[product].quantity;
                }
            }
            return total.toFixed(2);
        },

        // Return cart visibility state
        getCartVisible: function() {
            return _cartVisible;
        },

        // Emit Change event
        emitChange: function() {
            this.emit(CHANGE_EVENT);
        },

        // Add change listener
        addChangeListener: function(callback) {
            this.on(CHANGE_EVENT, callback);
        },

        // Remove change listener
        removeChangeListener: function(callback) {
            this.removeListener(CHANGE_EVENT, callback);
        }

    });

    // Register callback with AppDispatcher
    AppDispatcher.register(function(payload) {
        var action = payload.action;

        switch(action.actionType) {

            // Respond to CART_ADD action
            case FluxCartConstants.CART_ADD:
                add(action.sku, action.update);
                break;

            // Respond to CART_VISIBLE action
            case FluxCartConstants.CART_VISIBLE:
                setCartVisible(action.cartVisible);
                break;

            // Respond to CART_REMOVE action
            case FluxCartConstants.CART_REMOVE:
                removeItem(action.sku);
                break;

            default:
                return true;
        }

        // If action was responded to, emit change event
        CartStore.emitChange();

        return true;

    });

    module.exports = CartStore;

})();
