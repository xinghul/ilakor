"use strict"

import _ from "lodash"

import React from "react"
import { Grid, Row, Col } from "react-bootstrap"
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap"
import { Modal, Table, Label, Glyphicon, Button } from "react-bootstrap"

import BaseInput from "lib/BaseInput"
import MultiSelectInput from "lib/MultiSelectInput"
import ItemDetailModal from "./ItemManageApp/ItemDetailModal"
import ImageUploader from "./ItemManageApp/ImageUploader"

import ItemManageAction from "actions/ItemManageAction"
import ItemManageStore from "stores/ItemManageStore"

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
      
      showItemInfoModal: false,
      selectedItem: null
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
   * Handler when submit button is clicked.
   */
  handleSubmit = () => {
    ItemManageAction.addItem({
      name: this.refs["name"].getValue(),
      tag: this.refs["tag"].getValue(),
      image: this.refs["image"].getValue(),
      
      price: {
        base: this.refs["price"].getValue()
      }
      
    }).catch(function(err) {
      console.log(err);
    });
  };
  
  /**
   * Handler for item in the table being clicked.
   * @param  {Object} item the clicked item.
   */
  handleItemClick = (item) => {
    this.setState({
      showItemInfoModal: true,
      selectedItem: item
    });
  };
  
  onItemInfoModalClose = () => {
    this.setState({
      showItemInfoModal: false
    });
  };
  
  onItemInfoModalApply = (newValue) => {
    let me = this;
    
    ItemManageAction.updateItem(
      this.state.selectedItem._id,
      newValue
    ).then(function() {
      me.onItemInfoModalClose();
    }).catch(function(err) {
      console.log(err);
    })
  };
  
  onItemInfoModalDelete = () => {
    let me = this;
    
    ItemManageAction.removeItem(
      this.state.selectedItem._id
    ).then(function() {
      me.onItemInfoModalClose();
    }).catch(function(err) {
      console.log(err);
    })
  };
  
  createItemListTable() {
    let items = this.state.items
    ,   item
    ,   tableBody = [];
    
    for (let index = 0; index < items.length; index++)
    {
      item = items[index];
      
      tableBody.push(
        <tr onClick={this.handleItemClick.bind(this, item)} key={item._id}>
          <td>{index}</td>
          <td>{item.name}</td>
          <td>{item.price.base}</td>
          <td>{item.tag.join(",")}</td>
        </tr>
      );
    }
    
    let itemListTable = (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Tag</th>
          </tr>
        </thead>
        <tbody>
          {tableBody}
        </tbody>
      </Table>
    );
    
    return itemListTable;
  }
  
  createTagOptions() {
    let tags = this.state.tags
    ,   tagOptions = [];
    
    for (let tag of tags)
    {
      tagOptions.push(tag.name);
    }
    
    return tagOptions;
  }
  
  render() {
    let formStyle = {
      backgroundColor: "#fff",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "#ddd",
      borderRadius: "4px 4px 0 0",
      
      padding: "15px"
    };
    
    let headerColStyle = {
      top: "-32px",
      left: "-10px"
    };
    
    let nameInput = (
      <BaseInput
        type="text"
        ref="name"
        label="Name"
        placeholder="Enter name"
        addonBefore="info-sign"
      />
    );
    
    let tagOptions = this.createTagOptions();
    
    let tagInput = (
      <MultiSelectInput
        ref="tag"
        placeholder="Select tags"
        options={tagOptions}
      />
    );
    
    let imagesInput = (
      <ImageUploader ref="image"/>
    );
    
    let priceInput = (
      <BaseInput
        type="text"
        ref="price"
        label="Price"
        placeholder="Enter price"
      />
    );
    
    let submitButton = (
      <Button onClick={this.handleSubmit}>
        Add
      </Button>
    );
    
    let addItemForm = (
      <div style={formStyle}>
        <Row>
          <Col xs={12} style={headerColStyle}>
            <h2><Label>Add new item</Label></h2>
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            {nameInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {tagInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {imagesInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {priceInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {submitButton}
          </Col>
        </Row>
      </div>
    );
    
    let itemListForm = this.createItemListTable();
    
    let itemInfoModal = (
      <ItemDetailModal 
        showModal={this.state.showItemInfoModal} 
        item={this.state.selectedItem}
        onClose={this.onItemInfoModalClose}
        onApply={this.onItemInfoModalApply}
        onDelete={this.onItemInfoModalDelete}
        />
    );
    
    let style = {
      position: "absolute"
    };
    
    return (
      <div style={style}>
        {itemInfoModal}
        <Grid fluid>
          <Row>
            <Col xs={5}>
              {addItemForm}
            </Col>
            <Col xs={7}>
              {itemListForm}
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
  
}
