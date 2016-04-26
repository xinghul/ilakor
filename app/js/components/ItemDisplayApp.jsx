"use strict"

import React from "react"
import Infinite from "react-infinite"

import BaseGrid from "lib/BaseGrid.jsx"
import Loader from "lib/Loader.jsx"

import ItemDisplayStore from "stores/ItemDisplayStore"
import ItemDisplayAction from "actions/ItemDisplayAction"
import ItemDetailModal from "./ItemDisplayApp/ItemDetailModal.jsx"

function getStateFromStores() {
  return {
    items: ItemDisplayStore.getItems(),
    hasMoreItems: ItemDisplayStore.getHasMoreItems()
  };
}

export default class ItemDisplayApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this._onChange = this._onChange.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.onItemDetailModalClose = this.onItemDetailModalClose.bind(this);
    this.handleInfiniteLoad = this.handleInfiniteLoad.bind(this);
    
    this.state = {
      items: ItemDisplayStore.getItems(),
      hasMoreItems: ItemDisplayStore.getHasMoreItems(), 
      
      selectedItem: {},
      showItemDetailModal: false,
      isLoading: false
    };
  }
  
  _onChange() {
    this.setState(getStateFromStores());
  }
  
  componentDidMount() {
    let me = this;
    
    ItemDisplayStore.addChangeListener(this._onChange);
  }
  
  componentWillUnmount() {
    ItemDisplayStore.removeChangeListener(this._onChange);    
  }
  
  handleItemClick(item) {
    this.setState({
      selectedItem: item,
      showItemDetailModal: true
    });
  }
  
  handleInfiniteLoad() {
    if (!this.state.hasMoreItems) {
      return;
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
  }
  
  onItemDetailModalClose() {
    this.setState({
      showItemDetailModal: false
    });
  }
  
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
          infiniteLoadBeginEdgeOffset={200}
          onInfiniteLoad={this.handleInfiniteLoad}
          loadingSpinnerDelegate={this.elementInfiniteLoad()}
          isInfiniteLoading={this.state.isLoading}>
          
          <BaseGrid
            items={this.state.items} 
            handleItemClick={this.handleItemClick} />
        </Infinite>
      </div>
    );
  }
  
}
