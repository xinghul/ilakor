"use strict"

import _ from "underscore"

import React from "react"
import { Grid, Row, Col } from "react-bootstrap"
import { Modal, Table, Label, Input, Glyphicon, Button } from "react-bootstrap"
import LinkedStateMixin from "react-addons-linked-state-mixin"

import BaseInput from "../lib/BaseInput.jsx"
import BaseModal from "../lib/BaseModal.jsx"

import ItemManageAction from "../actions/ItemManageAction"
import ItemManageStore from "../stores/ItemManageStore"

function getStateFromStores() {
  return {
    items: ItemManageStore.getItems()
  };
}

export default class ItemManageApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      name: "",
      category: [],
      weight: "",
      
      items: [],
      
      showItemInfoModal: false,
      selectedItem: null
    };
  }
  
  handleSubmit() {
    // FIXME: make it unclickable
    if (_.isEmpty(this.state.name) || _.isEmpty(this.state.weight) || _.isEmpty(this.state.category)) {
      return;  
    }
    
    ItemManageAction.addItem({
      name: this.state.name,
      weight: this.state.weight,
      category: this.state.category
    }).catch(function(err) {
      console.log(err);
    });
  }
  
  handleNameChange(newValue) {
    this.setState({
      name: newValue
    });
  }
  
  handleWeightChange(newValue) {
    this.setState({
      weight: newValue
    });
  }
  
  handleTagsChange(newValue) {
    // FIXME: trim tabs and spaces
    this.setState({
      category: newValue.split(",")
    });
  }
  
  handleItemClick(item) {
    this.setState({
      showItemInfoModal: true,
      selectedItem: item
    });
  }
  
  onItemInfoModalClose() {
    this.setState({
      showItemInfoModal: false
    });
  }
  
  onItemInfoModalApply(newValue) {
    let me = this;
    
    ItemManageAction.updateItem(
      this.state.selectedItem._id,
      newValue
    ).then(function() {
      me.onItemInfoModalClose();
    }).catch(function(err) {
      console.log(err);
    })
  }
  
  onItemInfoModalDelete() {
    let me = this;
    
    ItemManageAction.removeItem(
      this.state.selectedItem._id
    ).then(function() {
      me.onItemInfoModalClose();
    }).catch(function(err) {
      console.log(err);
    })
  }
  
  _onChange() {
    this.setState(getStateFromStores());
  }
  
  componentDidMount() {
    ItemManageStore.addChangeListener(this._onChange.bind(this));
    
    ItemManageAction.getAllItems();
  }
  
  componentWillUnmount() {
    ItemManageStore.removeChangeListener(this._onChange.bind(this));
  }
  
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
          <td>{item.weight}</td>
          <td>{item.category}</td>
        </tr>
      );
    }
    
    let itemListTable = (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Weight</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {tableBody}
        </tbody>
      </Table>
    );
    
    return itemListTable;
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
    
    let nameValueLink = {
      value: this.state.name,
      requestChange: this.handleNameChange
    };
    

    let nameInput = (
      <BaseInput
        type="text"
        placeholder="Enter name"
        addonBefore="info-sign"
        handleChange={this.handleNameChange.bind(this)} />
    );
    
    let categoryInput = (
      <BaseInput
        type="text"
        placeholder="Enter categories, split by ','"
        addonBefore="tags"
        handleChange={this.handleTagsChange.bind(this)} />
    );
    
    let weightInput = (
      <BaseInput
        type="text"
        label="Weight"
        placeholder="Enter weight in pounds"
        handleChange={this.handleWeightChange.bind(this)} />
    );
    
    let dimensionInput = (
      <Input label="Dimension" wrapperClassName="wrapper">
        <Row>
          <Col xs={4}>
            <Input 
              type="text"
              placeholder="Length" />
          </Col>
          <Col xs={4}>
            <Input 
              type="text"
              placeholder="Width" />
          </Col>
          <Col xs={4}>
            <Input 
              type="text"
              placeholder="Height" />
          </Col>
        </Row>
      </Input>
    );
    
    let imagesInput = (
      <Input 
        type="file"
        label="Images"
        placeholder="Select images"
        multiple
        groupClassName="group-class"
        labelClassName="label-class" />
    );
    
    let submitButton = (
      <Button onClick={this.handleSubmit.bind(this)}>
        Add
      </Button>
    );
    
    let addItemForm = (
      <form style={formStyle}>
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
            {categoryInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {weightInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {dimensionInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {imagesInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {submitButton}
          </Col>
        </Row>
      </form>
    );
    
    let itemListForm = this.createItemListTable();
    
    let itemInfoModal = (
      <BaseModal 
        showModal={this.state.showItemInfoModal} 
        item={this.state.selectedItem}
        onClose={this.onItemInfoModalClose.bind(this)}
        onApply={this.onItemInfoModalApply.bind(this)}
        onDelete={this.onItemInfoModalDelete.bind(this)}
        />
    );
    
    return (
      <div>
        {itemInfoModal}
        <Grid>
          <Row>
            <Col xs={4}>
              {addItemForm}
            </Col>
            <Col xs={8}>
              {itemListForm}
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
  
}
