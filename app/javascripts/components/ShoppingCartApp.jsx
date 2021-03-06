import React from "react";
import _ from "lodash";
import Numeral from "numeral";
import { hashHistory } from "react-router";

import { Glyphicon, OverlayTrigger, Popover, MenuItem } from "react-bootstrap";
import { Image, SplitButton } from "react-bootstrap";

import CheckoutApp from "components/CheckoutApp";

import ShoppingCartStore from "stores/ShoppingCartStore";
import AuthStore from "stores/AuthStore";

import ShoppingCartAction from "actions/ShoppingCartAction";
import AuthAction from "actions/AuthAction";

import GhostButton from "lib/GhostButton";

import styles from "components/ShoppingCartApp.scss";

/**
 * @private
 *
 * Gets the new state from subscribed stores.
 * 
 * @return {Object}
 */
function getStateFromStores() {
  return {
    items: ShoppingCartStore.getItems(),
    totalPrice: ShoppingCartStore.getTotalPrice(),
    user: AuthStore.getUser()
  };
}

/**
 * @private
 * Handler for the count dropdown's 'select' event.
 * 
 * @param  {String} id    the id for the selected item.
 * @param  {String} count new selected count.
 */
function _onCountSelect(id, count) {
  ShoppingCartAction.setItemCount(id, parseInt(count))
  .finally(() => {});
}

/**
 * @private
 * Handler for when the clear cart button is clicked.
 */
function _onClearCart() {
  ShoppingCartAction.clearCart()
  .finally(() => {});
}

/**
 * @private
 *
 * Handler for when the checkout button is clicked.
 */
function _onCheckoutClick() {
  hashHistory.push("/checkout");
};

/**
 * @private
 * Creates the JSX for the cart item.
 * 
 * @param  {String} itemInfo  the info for the item.
 *
 * @return {JSX}
 */
function _createCartItem(itemInfo) {
  let count = itemInfo.count
  ,   imageUrl = "http://d16knxx0wtupz9.cloudfront.net/" + itemInfo.item.images[0].name
  ,   id = itemInfo.variation._id;
  
  // popover is appended to dom on the fly, css modules doesn't work
  let itemStyle = {
    display: "flex",
    flexDirection: "row",

    marginBottom: "10px",

    height: "60px",
  };
  
  let imageStyle = {
    marginRight: "10px",
    
    width: "60px",
    height: "100%",
    
    objectFit: "cover"
  };
  
  let infoStyle = {
    display: "flex",
    flexDirection: "column",
    
    flex: "1",
    height: "100%"
  };
  
  let nameStyle = {
    flex: "1",
    
    fontFamily: "Courgette, cursive",
    fontSize: "20px",
    fontWeight: "600"
  };
  
  let priceCountStyle = {
    flex: "1"
  };
  
  let countStyle = {
    float: "right"
  };
  
  return (
    <div key={_.uniqueId(id)} style={itemStyle}>
      <Image style={imageStyle} src={imageUrl} thumbnail />
      <div style={infoStyle}>
        <div style={nameStyle}>
          {itemInfo.item.name}
        </div>
        <div style={priceCountStyle}>
          <span>
            {Numeral(itemInfo.variation.price).format("$0,0.00")}
          </span>
          <span style={countStyle}>
            <SplitButton 
              onSelect={_onCountSelect.bind(this, id)}
              bsSize="xsmall" 
              title={count} 
              key={_.uniqueId(id)} 
              id={`split-button-basic-${id}`}>
              <MenuItem eventKey="1">1</MenuItem>
              <MenuItem eventKey="2">2</MenuItem>
              <MenuItem eventKey="3">3</MenuItem>
              <MenuItem eventKey="4">4</MenuItem>
              <MenuItem eventKey="5">5</MenuItem>
              <MenuItem eventKey="6">6</MenuItem>
              <MenuItem eventKey="7">7</MenuItem>
              <MenuItem eventKey="8">8</MenuItem>
              <MenuItem eventKey="9">9</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey="0">Delete</MenuItem>
            </SplitButton>
          </span>
        </div>
      </div>
      
    </div>
  );
}

export default class ShoppingCartApp extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = getStateFromStores();
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    ShoppingCartStore.subscribe(this._onChange);
    
    AuthStore.subscribe(this._onChange);
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    ShoppingCartStore.unsubscribe(this._onChange);
    
    AuthStore.unsubscribe(this._onChange);
  }
  
  /**
   * @private
   * Handler for when the subscribed stores emit 'change' event.
   */
  _onChange = () => {
    this.setState(getStateFromStores());
  };
  
  /**
   * @private
   * Handler for when the login link is clicked.
   */
  _onLoginClick = () => {
    AuthAction.showModal();
  };
  
  /**
   * Creates the JSX for the cart popover.
   * 
   * @return {JSX}
   */
  createCartPopover() {
    
    let items = this.state.items
    ,   displayItems = []
    ,   totalPrice = this.state.totalPrice
    ,   notLoggedIn = _.isEmpty(this.state.user)
    ,   cartEmpty = _.isEmpty(items);

    for (let key of Object.keys(items))
    {
      displayItems.push(_createCartItem(items[key]));
    }
    
    let priceStyle = {
      marginBottom: "10px",
      textAlign: "right",
      fontSize: "20px"
    };
    
    let buttonGroupStyle = {
      display: cartEmpty ? "none" : "block",
      textAlign: "right"
    };
    
    let clearCartButtonStyle = {
      marginRight: "10px"
    };
    
    let notLoggedInInfoStyle = {
      display: !cartEmpty && notLoggedIn ? "block" : "none",
      float: "right",
      padding: "5px 0px",
      fontSize: "13px",
      fontStyle: "italic",
      color: "#ccc"
    };

    return (
      <Popover id="shoppingCartPopover" title="Shopping cart">
        {displayItems}
        <div style={priceStyle}>Total: {Numeral(totalPrice).format("$0,0.00")}</div>
        <div style={buttonGroupStyle}>
          <GhostButton style={clearCartButtonStyle} theme="black" onClick={_onClearCart}>Clear cart</GhostButton>
          <GhostButton disabled={notLoggedIn} theme="warning" onClick={_onCheckoutClick}>Checkout</GhostButton>
        </div>
        <div style={notLoggedInInfoStyle}><a onClick={this._onLoginClick}>Log in</a> before you can checkout.</div>
      </Popover>
    );
  }
  
  /**
   * @inheritdoc
   */
  render() {
    let popover = this.createCartPopover();
    
    return (
      <div className={styles.shoppingCart}>
        <OverlayTrigger 
          trigger="click"
          rootClose 
          placement="bottom" 
          overlay={popover}>
          <GhostButton className={styles.cartButton} theme="gold">
            <Glyphicon glyph="shopping-cart" />
            {' '}
            ({Object.keys(this.state.items).length})
          </GhostButton>
        </OverlayTrigger>
      </div>
    );
  }
  
}
