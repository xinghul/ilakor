"use strict"

import React from "react"

import BaseGrid from "../lib/BaseGrid.jsx"

import ItemDisplayStore from "../stores/ItemDisplayStore"
import ItemDisplayAction from "../actions/ItemDisplayAction"
import ItemDetailModal from "./ItemDisplayApp/ItemDetailModal.jsx"

function getStateFromStores() {
  return {
    items: ItemDisplayStore.getItems(),
    selectedItem: {},
    showItemDetailModal: false
  };
}

export default class ItemDisplayApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this._onChange = this._onChange.bind(this);
    
    this.state = getStateFromStores();
  }
  
  _onChange() {
    this.setState(getStateFromStores());
  }
  
  componentDidMount() {
    ItemDisplayStore.addChangeListener(this._onChange);
    
    ItemDisplayAction.getAllItems();
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
  
  onItemDetailModalClose() {
    this.setState({
      showItemDetailModal: false
    });
  }
  
  render() {
    let itemDetailModal = (
      <ItemDetailModal 
        showModal={this.state.showItemDetailModal} 
        item={this.state.selectedItem}
        onClose={this.onItemDetailModalClose.bind(this)}
        />
    )
    return (
      <div>
        {itemDetailModal}
        <BaseGrid 
          items={this.state.items} 
          handleItemClick={this.handleItemClick.bind(this)} />
      </div>
    );
  }
  
}
