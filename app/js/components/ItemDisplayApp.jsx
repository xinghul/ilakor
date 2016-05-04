"use strict"

import React from "react"
import Infinite from "react-infinite"

import BaseGrid from "lib/BaseGrid.jsx"
import Loader from "lib/Loader.jsx"

import ItemDisplayStore from "stores/ItemDisplayStore"
import ItemDisplayAction from "actions/ItemDisplayAction"
import ShoppingCartAction from "actions/ShoppingCartAction"
import ItemDetailModal from "./ItemDisplayApp/ItemDetailModal.jsx"

function getStateFromStores() {
  return {
    items: ItemDisplayStore.getItems(),
    hasMoreItems: ItemDisplayStore.hasMoreItems()
  };
}

export default class ItemDisplayApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      items: ItemDisplayStore.getItems(),
      hasMoreItems: ItemDisplayStore.hasMoreItems(), 
      
      selectedItem: {},
      showItemDetailModal: false,
      isLoading: false
    };
  }
  
  componentDidMount() {
    ItemDisplayStore.addChangeListener(this._onChange);
  }
  
  componentWillUnmount() {
    ItemDisplayStore.removeChangeListener(this._onChange);    
  }
  
  _onChange = () => {
    this.setState(getStateFromStores());
  };
  
  handleItemClick = (item) => {
    this.setState({
      selectedItem: item,
      showItemDetailModal: true
    });
  };
  
  handleAddToCartClick = (item) => {
    ShoppingCartAction
    .addToCart(item)
    .finally(function() {
      console.log("added to cart", item);
    });
  };
  
  handleInfiniteLoad = () => {
    if (!this.state.hasMoreItems) {
      return false;
    }
    
    let me = this;
    
    this.setState({
      isLoading: true
    });
    
    ItemDisplayAction
    .getItems()
    .finally(function() {
      me.setState({
        isLoading: false
      });
    });
  };
  
  onItemDetailModalClose = () => {
    this.setState({
      showItemDetailModal: false
    });
  };
  
  elementInfiniteLoad() {
    let loadSpinner = (
      <Loader hidden={!this.state.isLoading} />
    );
    
    return loadSpinner;
  }
  
  render() {
    let itemDetailModal = (
      <ItemDetailModal 
        showModal={this.state.showItemDetailModal} 
        item={this.state.selectedItem}
        onClose={this.onItemDetailModalClose}
        />
    );
    
    return (
      <div>
        {itemDetailModal}
        <Infinite
          elementHeight={200}
          useWindowAsScrollContainer
          infiniteLoadBeginEdgeOffset={40}
          onInfiniteLoad={this.handleInfiniteLoad}
          loadingSpinnerDelegate={this.elementInfiniteLoad()}
          isInfiniteLoading={this.state.isLoading}>
          
          <BaseGrid
            items={this.state.items} 
            handleItemClick={this.handleItemClick}
            handleAddToCartClick={this.handleAddToCartClick} />
        </Infinite>
      </div>
    );
  }
  
}
