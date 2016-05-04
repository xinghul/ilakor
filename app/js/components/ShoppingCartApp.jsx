"use strict"

import React from "react"
import CSSModules from "react-css-modules"

import GhostButton from "lib/GhostButton.jsx"
import { Glyphicon, OverlayTrigger, Popover, MenuItem } from "react-bootstrap"
import { Image, Button, SplitButton, ButtonToolbar } from "react-bootstrap"
import { Grid, Row, Col } from "react-bootstrap"

import ShoppingCartStore from "stores/ShoppingCartStore"
import ShoppingCartAction from "actions/ShoppingCartAction"
import ItemUtil from "utils/ItemUtil"

import styles from "./ShoppingCartApp.css"

function getStateFromStores() {
  return {
    items: ShoppingCartStore.getItems()
  };
}

function handleCountSelect(id, count) {
  ShoppingCartAction.setItemCount(id, parseInt(count))
  .finally(function() {
    
  });
}

function handleClearCart() {
  ShoppingCartAction.clearCart()
  .finally(function() {
    
  });
}

function createCartPopoverItem(itemInfo) {
  let count = itemInfo.count
  ,   item = itemInfo.item
  ,   imageUrl = "http://d2nl38chx1zeob.cloudfront.net/" + item.images[0].name;
  
  // popover is appended to dom on the fly, css modules doesn't work
  let itemStyle = {
    height: "60px",
    marginBottom: "10px"
  };
  
  let imageStyle = {
    float: "left",
    maxWidth: "100%",
    maxHeight: "100%"
  };
  
  let infoStyle = {
    float: "left",
    marginLeft: "20px"
  };
  
  let nameStyle = {
    height: "30px",
    fontFamily: "Courgette, cursive",
    fontSize: "20px",
    fontWeight: "600",
    textAlign: "center"
  };
  
  let priceCountStyle = {
    height: "30px"
  };
  
  let priceStyle = {
    marginRight: "10px"
  };
  
  return (
    <div key={item._id} style={itemStyle}>
      <Image style={imageStyle} src={imageUrl} thumbnail />
      <div style={infoStyle}>
        <div style={nameStyle}>
          {item.name}
        </div>
        <div style={priceCountStyle}>
          <span style={priceStyle}>
            {ItemUtil.createPriceJsx(item.feature.price)}
          </span>
          <SplitButton 
            onSelect={handleCountSelect.bind(this, item._id)}
            bsSize="xsmall" 
            title={count} 
            key={item._id} 
            id={`split-button-basic-${item._id}`}>
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
        </div>
      </div>
      
    </div>
  );
}

function createCartPopover(items) {
  let displayItems = []
  ,   totalPrice = 0;
  
  for (let key of Object.keys(items))
  {
    totalPrice += items[key].item.feature.price * items[key].count;
    
    displayItems.push(createCartPopoverItem(items[key]));
  }
  
  let priceStyle = {
    marginBottom: "10px",
    textAlign: "right",
    fontSize: "20px"
  };
  
  return (
    <Popover id="shoppingCartPopover" title="Shopping cart">
      {displayItems}
      <div style={priceStyle}>Total: {ItemUtil.createPriceJsx(totalPrice)}</div>
      <ButtonToolbar>
        <Button onClick={handleClearCart}>Clear cart</Button>
        <Button bsStyle="warning">Checkout</Button>
      </ButtonToolbar>
    </Popover>
  );
}

class ShoppingCartApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = getStateFromStores();
  }
  
  componentDidMount() {
    ShoppingCartStore.addChangeListener(this._onChange);
  }
  
  componentWillUnmount() {
    ShoppingCartStore.removeChangeListener(this._onChange);
  }

  _onChange = () => {
    this.setState(getStateFromStores());
  };
  
  render() {
    let popover = createCartPopover(this.state.items);
    
    return (
      <div styleName="shoppingCart">
        <OverlayTrigger 
          trigger="focus" 
          placement="bottom" 
          overlay={popover}>
          <GhostButton>
            <Glyphicon glyph="shopping-cart" />
            ({Object.keys(this.state.items).length})
          </GhostButton>
        </OverlayTrigger>
      </div>
    );
  }
  
}

export default CSSModules(ShoppingCartApp, styles)