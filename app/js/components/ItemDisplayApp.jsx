"use strict"

import React from "react"

import BaseGrid from "../lib/BaseGrid.jsx"

import ItemDisplayStore from "../stores/ItemDisplayStore"
import ItemDisplayAction from "../actions/ItemDisplayAction"

function getStateFromStores() {
  return {
    items: ItemDisplayStore.getItems()
  };
}

export default class ItemDisplayApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = getStateFromStores();
  }
  
  _onChange() {
    this.setState(getStateFromStores());
  }
  
  componentDidMount() {
    ItemDisplayStore.addChangeListener(this._onChange.bind(this));
    
    ItemDisplayAction.getAllItems();
  }
  
  componentWillUnmount() {
    ItemDisplayStore.removeChangeListener(this._onChange.bind(this));
  }
  
  render() {
    return (
      <BaseGrid items={this.state.items} />
    );
  }
  
}
