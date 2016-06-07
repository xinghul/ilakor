"use strict"

import _ from "lodash"

import React from "react"
import { Grid, Row, Col } from "react-bootstrap"
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap"
import { Modal, Table, Label, Glyphicon, Button, Well } from "react-bootstrap"

import BaseInput from "lib/BaseInput"
import MultiSelectInput from "lib/MultiSelectInput"
import ItemDetailModal from "./ItemManageApp/ItemDetailModal"
import ImageUploader from "./ItemManageApp/ImageUploader"
import DimensionRangeInput from "./ItemManageApp/DimensionRangeInput"

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
      
      showItemInfoModal: false,
      selectedItem: null,
      addItemErrorMsg: ""
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
    let heightConfig = this.refs["height"].getValue()
    ,   heightValues;
    
    if (!_.isEmpty(heightConfig)) {
      heightValues = {
        baseHeight: heightConfig.baseValue,
        heightCustomizable: heightConfig.valueCustomizable
      };
      
      if (heightValues.heightCustomizable) {
        heightValues["maxHeight"] = heightConfig.maxValue,
        heightValues["minHeight"] = heightConfig.minValue
      }
    }
    
    let widthConfig = this.refs["width"].getValue()
    ,   widthValues;
    
    if (!_.isEmpty(widthConfig)) {
      widthValues = {
        baseWidth: widthConfig.baseValue,
        widthCustomizable: widthConfig.valueCustomizable
      };
      
      if (widthValues.widthCustomizable) {
        widthValues["maxWidth"] = widthConfig.maxValue,
        widthValues["minWidth"] = widthConfig.minValue
      }
    }
    
    let depthConfig = this.refs["depth"].getValue()
    ,   depthValues;
    
    if (!_.isEmpty(depthConfig)) {
      depthValues = {
        baseDepth: depthConfig.baseValue,
        depthCustomizable: depthConfig.valueCustomizable
      };
      
      if (depthValues.depthCustomizable) {
        depthValues["maxDepth"] = depthConfig.maxValue,
        depthValues["minDepth"] = depthConfig.minValue
      }
    }
    
    if (_.isEmpty(heightValues) || _.isEmpty(widthValues) || _.isEmpty(depthValues)) {
      return;
    }
        
    ItemManageAction.addItem({
      name: this.refs["name"].getValue(),
      tag: this.refs["tag"].getValue(),
      image: this.refs["image"].getValue(),
      
      price: {
        base: this.refs["price"].getValue()
      },
      
      dimension: {
        ...heightValues,
        ...widthValues,
        ...depthValues
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
        label="Tags"
        placeholder="Select tags"
        options={tagOptions}
      />
    );
    
    let imagesInput = (
      <ImageUploader ref="image" />
    );
    
    let heightInput = (
      <DimensionRangeInput label="Height" ref="height" />
    );
    
    let widthInput = (
      <DimensionRangeInput label="Width" ref="width" />
    );
    
    let depthInput = (
      <DimensionRangeInput label="Depth" ref="depth" />
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
      <div className={styles.addItemForm}>
        <Row>
          <Col xs={12} md={12}>
            <h2><Label>Add new item</Label></h2>
          </Col>
        </Row>
        <Row>
          <Col xs={8} md={8}>
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
          <Col xs={12} md={12}>
            {heightInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12}>
            {widthInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12}>
            {depthInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {priceInput}
          </Col>
        </Row>
        <Row hidden={_.isEmpty(this.state.addItemErrorMsg)}>
          <Col xs={12} md={12}>
            <Well>{this.state.addItemErrorMsg}</Well>
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
    
    return (
      <div className={styles.itemManageApp}>
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
