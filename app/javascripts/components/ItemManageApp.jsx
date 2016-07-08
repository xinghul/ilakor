"use strict"

import _ from "lodash"

import React from "react"
import { Row, Col } from "react-bootstrap"

import ItemDetailModal from "./ItemManageApp/ItemDetailModal"
import ItemListTable from "./ItemManageApp/ItemListTable"
import AddItemForm from "./ItemManageApp/AddItemForm"

import ItemManageAction from "actions/ItemManageAction"
import ItemManageStore from "stores/ItemManageStore"

import styles from "components/ItemManageApp.scss"

function getStateFromStores() {
  return {
    items: ItemManageStore.getItems(),
    tags: ItemManageStore.getTags()
  };
}

export default class ItemManageApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      items: ItemManageStore.getItems(),
      tags: ItemManageStore.getTags(),
      
      selectedItem: {}
    };
  }
  
  componentDidMount() {
    ItemManageStore.addChangeListener(this._onChange);
    
    ItemManageAction.getItems();
    
    ItemManageAction.getAllTags();
  }
  
  componentWillUnmount() {
    ItemManageStore.removeChangeListener(this._onChange);
  }
  
  _onChange = () => {
    this.setState(getStateFromStores());
  };
  
  /**
   * Handler for item in the table being clicked.
   * @param  {Object} item the clicked item.
   */
  handleItemClick = (item) => {
    this.setState({
      selectedItem: item
    });
    
    this.refs["itemModal"].showModal();
  };  
  
  render() {
    
    return (
      <div className={styles.itemManageApp}>
        <ItemDetailModal 
          item={this.state.selectedItem}
          ref="itemModal"
        />
        <Row>
          <Col xs={12} md={6}>
            <AddItemForm 
              tags={this.state.tags} 
            />
          </Col>
          <Col xs={12} md={6}>
            <ItemListTable 
              items={this.state.items} 
              handleItemClick={this.handleItemClick}
            />
          </Col>
        </Row>
      </div>
    )
  }
  
}
