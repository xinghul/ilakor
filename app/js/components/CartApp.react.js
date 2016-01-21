(function() {
    "use strict";

    var React = require("react");

    var CartStore = require("../stores/CartStore"),
        ProductStore = require("../stores/ProductStore");

    var Product = require("./CartApp/Product.react"),
        Cart = require("./CartApp/Cart.react");

    // Method to retrieve state from Stores
    function getCartState() {
        return {
            product: ProductStore.getProduct(),
            selectedProduct: ProductStore.getSelected(),
            cartItems: CartStore.getCartItems(),
            cartCount: CartStore.getCartCount(),
            cartTotal: CartStore.getCartTotal(),
            cartVisible: CartStore.getCartVisible()
        };
    }

    // Define main Controller View
    var CartApp = React.createClass({

        // Get initial state from stores
        getInitialState: function() {
            return getCartState();
        },

        // Add change listeners to stores
        componentDidMount: function() {
            ProductStore.addChangeListener(this._onChange);
            CartStore.addChangeListener(this._onChange);
        },

        // Remove change listers from stores
        componentWillUnmount: function() {
            ProductStore.removeChangeListener(this._onChange);
            CartStore.removeChangeListener(this._onChange);
        },

        // Render our child components, passing state via props
        render: function() {
            return (
                <div className="flux-cart-app">
                    <Cart products={this.state.cartItems} count={this.state.cartCount} total={this.state.cartTotal} visible={this.state.cartVisible} />
                    <Product product={this.state.product} cartitems={this.state.cartItems} selected={this.state.selectedProduct} />
                </div>
            );
        },

        // Method to setState based upon Store changes
        _onChange: function() {
            this.setState(getCartState());
        }

    });

    module.exports = CartApp;

})();