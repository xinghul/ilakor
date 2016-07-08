"use strict"

import React from "react"
import Promise from "bluebird"

import ItemDisplayStore from "stores/ItemDisplayStore"
import ItemDisplayAction from "actions/ItemDisplayAction"
import ShoppingCartAction from "actions/ShoppingCartAction"

import ItemDisplayGrid from "./ItemDisplayApp/ItemDisplayGrid"
import ItemDetailModal from "./ItemDisplayApp/ItemDetailModal"
import ItemFilterApp from "./ItemDisplayApp/ItemFilterApp"
import FilterDisplayApp from "./ItemDisplayApp/FilterDisplayApp"
import LoadItemSpinner from "./ItemDisplayApp/LoadItemSpinner"

import styles from "components/ItemDisplayApp.scss"

Promise.config({cancellation: true});

function getStateFromStores() {
  return {
    items: ItemDisplayStore.getItems(),
    filters: ItemDisplayStore.getFilters(),
    hasMoreItems: ItemDisplayStore.hasMoreItems()
  };
}

let _getItemPromise = null
,   _addItemPromise = null;

export default class ItemDisplayApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      items: ItemDisplayStore.getItems(),
      filters: ItemDisplayStore.getFilters(),
      hasMoreItems: ItemDisplayStore.hasMoreItems(), 
      
      selectedItem: {},
      showItemDetailModal: false,
      isLoading: false,
      isItemsAdded: true
    };
  }
  
  componentDidMount() {
    ItemDisplayStore.addChangeListener(this._onChange);
    
    window.addEventListener("scroll", this._checkReachBottom);
    
    this._checkReachBottom(true);
  }
  
  componentWillUnmount() {
    ItemDisplayStore.removeChangeListener(this._onChange);
    
    window.removeEventListener("scroll", this._checkReachBottom); 

    if (_getItemPromise && _getItemPromise.isCancellable()) {
      _getItemPromise.cancel();
    }

    if (_addItemPromise && _addItemPromise.isCancellable()) {
      _addItemPromise.cancel();
    }
  }
  
  _onChange = () => {
    if (_addItemPromise && _addItemPromise.isCancellable())
    {
      _addItemPromise.cancel();
    }

    let newState = getStateFromStores()
    ,   items = this.state.items;

    let newItems = newState.items.slice(items.length);
    
    this.setState({
      hasMoreItems: newState.hasMoreItems,
      isItemsAdded: false
    });
    
    _addItemPromise = Promise.resolve(null);
    
    for (let item of newItems)
    {
      _addItemPromise = _addItemPromise.delay(200).then(() => {
        return new Promise((resolve, reject) => {
          items.push(item);
    
          this.setState({
            items: items
          });
          
          resolve();
        });
      });
    }

    _addItemPromise.then(() => {
      this.setState({
        isItemsAdded: true
      });
    }).catch(function(err) {
      console.log(err);
    });
  };
  
  handleRemoveFilter = (filterType, filterValue) => {
    ItemDisplayAction.removeFilter(filterType, filterValue).then(function() {
      
      console.log("removed " + filterType + ": " + filterValue);

    }).catch(function(err) {
      console.log(err);
    })
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
    // do nothing when it's already in the loading process
    // or when there's no more items 
    // or when new items are not fully added to the grid
    if (this.state.isLoading || 
       !this.state.hasMoreItems || 
       !this.state.isItemsAdded) {
      return;
    }
    
    this.setState({
      isLoading: true
    });

    _getItemPromise = ItemDisplayAction
    .getItems()
    .then(() => {
      this.setState({
        isLoading: false
      });
    });
  };
  
  onItemDetailModalClose = () => {
    this.setState({
      showItemDetailModal: false
    });
  };
  
  _checkReachBottom = (forceLoad) => {
    let scrollTop = 
      document.documentElement && document.documentElement.scrollTop || 
      document.body.scrollTop;
    
    let scrollHeight = 
      document.documentElement && document.documentElement.scrollHeight || 
      document.body.scrollHeight; 
    
    if (forceLoad || (scrollTop + window.innerHeight) >= scrollHeight) {
      this.doInfiniteLoad();
    }
  };
  
  render() {
    return (
      <div className={styles.itemDisplayApp}>
        <ItemDetailModal 
          showModal={this.state.showItemDetailModal} 
          item={this.state.selectedItem}
          onClose={this.onItemDetailModalClose}
        />
      <div className={styles.mainContent}>
          {/*
            <div className={styles.filterDisplaySection}>
              <ItemFilterApp />
            </div>            
          */}
          <div className={styles.itemDisplaySection}>
            {/*
              <FilterDisplayApp handleRemoveFilter={this.handleRemoveFilter} filters={this.state.filters}/>              
            */}
            <ItemDisplayGrid
              items={this.state.items} 
              handleItemClick={this.handleItemClick}
              handleAddToCartClick={this.handleAddToCartClick} />
            <LoadItemSpinner hidden={!this.state.isLoading} />
          </div>
        </div>
      </div>
    );
  }
  
}
