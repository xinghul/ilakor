"use strict"

import React from "react"
import Infinite from "react-infinite"

import BaseGrid from "lib/BaseGrid.jsx"
import LoadSpinner from "lib/LoadSpinner.jsx"

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
    
    this.doInfiniteLoad();
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
  
  doInfiniteLoad = () => {
    
    window.removeEventListener("scroll", this.handleScroll);    

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
      
      window.addEventListener("scroll", me.handleScroll);        
    });
  };
  
  onItemDetailModalClose = () => {
    this.setState({
      showItemDetailModal: false
    });
  };
  
  handleScroll = () => {
    let scrollTop = 
      document.documentElement && document.documentElement.scrollTop || 
      document.body.scrollTop;
    
    let scrollHeight = 
      document.documentElement && document.documentElement.scrollHeight || 
      document.body.scrollHeight; 
    
    if ((scrollTop + window.innerHeight) >= scrollHeight) {
      this.doInfiniteLoad();
    }
  };
  
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
        <BaseGrid
          items={this.state.items} 
          handleItemClick={this.handleItemClick}
          handleAddToCartClick={this.handleAddToCartClick} />
        <LoadSpinner hidden={!this.state.isLoading} />
      </div>
    );
  }
  
}
