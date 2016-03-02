"use strict"

import _ from "underscore"

import React from "react"
import { Grid, Row, Col } from "react-bootstrap"
import { Modal, Table, Label, Input, Glyphicon, Button } from "react-bootstrap"
import LinkedStateMixin from "react-addons-linked-state-mixin"

import BaseInput from "../lib/BaseInput.jsx"
import BaseMultiSelect from "../lib/BaseMultiSelect.jsx"
import BaseModal from "../lib/BaseModal.jsx"

import ItemManageAction from "../actions/ItemManageAction"
import ItemManageStore from "../stores/ItemManageStore"

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
      // new item info
      name: "",
      weight: "",
      tag: [],
      unitNumber: "",
      unitName: "",
      unitType: "",
      image: null,
      imagePreviewUrl: "",
      
      // items used to initialize the item display table
      items: [],
      // tags used to initialize the tag multiselect
      tags: [],
      
      showItemInfoModal: false,
      selectedItem: null
    };
  }
  
  /**
   * Handler when submit button is clicked.
   */
  handleSubmit() {
    // FIXME: make it unclickable
    if (_.isEmpty(this.state.name) || _.isEmpty(this.state.weight) || _.isEmpty(this.state.tag)) {
      return;  
    }
    
    ItemManageAction.addItem({
      name: this.state.name,
      weight: this.state.weight,
      tag: this.state.tag,
      image: this.state.image,
      
      unitNumber: this.state.unitNumber,
      unitName: this.state.unitName,
      unitType: this.state.unitType
    }).catch(function(err) {
      console.log(err);
    });
  }
  
  /**
   * Handler for name input value change.
   * @param  {String} newValue the new name value.
   */
  handleNameChange(newValue) {
    this.setState({
      name: newValue
    });
  }
  
  /**
   * Handler for weight input value change.
   * @param  {String} newValue the new weight value.
   */
  handleWeightChange(newValue) {
    this.setState({
      weight: newValue
    });
  }
  
  /**
   * Handler for tag input value change.
   * @param  {[String]} newValue the new tag value.
   */
  handleTagChange(newValue) {
    this.setState({
      tag: newValue
    });
  }
  
  /**
   * Handler for unit number input value change.
   * @param  {String} newValue the new unit number value.
   */
  handleUnitNumberChange(newValue) {
    this.setState({
      unitNumber: newValue
    });
  }
  
  /**
   * Handler for unit name input value change.
   * @param  {String} newValue the new unit name value.
   */
  handleUnitNameChange(newValue) {
    this.setState({
      unitName: newValue
    });
  }
  
  /**
   * Handler for unit name input value change.
   * @param  {String} newValue the new unit type value.
   */
  handleUnitTypeChange(newValue) {
    this.setState({
      unitType: newValue
    });
  }
  
  /**
   * Handler for image input value change.
   * @param  {String} newValue the new image value.
   */
  handleImageChange(evt) {
    evt.preventDefault();

    let files  = evt.target.files
    ,   images = [];
    
    for (let index = 0; index < files.length; index++)
    {
      let file = files[index]
      ,   reader = new FileReader();
      
      reader.onloadend = () => {
        images.push(file);
        
        if (index === files.length - 1) {
          this.setState({
            image: images
          });
        }
      }
      
      reader.readAsDataURL(file);
    }
  }
  
  /**
   * Handler for item in the table being clicked.
   * @param  {Object} item the clicked item.
   */
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
    
    ItemManageAction.getAllTags();
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
          <td>{item.tag.join(",")}</td>
          <td>{item.unitNumber}</td>
          <td>{item.unitName}</td>
          <td>{item.unitType}</td>
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
            <th>Tag</th>
            <th>Unit Number</th>
            <th>Unit Name</th>
            <th>Unit Type</th>
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
    
    let tagOptions = this.createTagOptions();
    
    let tagInput = (
      <BaseMultiSelect
        label="Tags"
        options={tagOptions}
        handleChange={this.handleTagChange.bind(this)} />
    );
    
    let weightInput = (
      <BaseInput
        type="text"
        label="Weight"
        placeholder="Enter weight in pounds"
        handleChange={this.handleWeightChange.bind(this)} />
    );
    
    let unitNumberInput = (
      <BaseInput
        type="text"
        label="Unit number"
        placeholder="Enter unit number"
        handleChange={this.handleUnitNumberChange.bind(this)} />
    );
    
    let unitNameInput = (
      <BaseInput
        type="text"
        label="Unit name"
        placeholder="Enter unit name"
        handleChange={this.handleUnitNameChange.bind(this)} />
    );
    
    let unitTypeInput = (
      <BaseInput
        type="text"
        label="Unit type"
        placeholder="Enter unit tyoe"
        handleChange={this.handleUnitTypeChange.bind(this)} />
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
        multiple
        placeholder="Select images"
        onChange={this.handleImageChange.bind(this)} />
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
            {tagInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {weightInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {unitNumberInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {unitNameInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {unitTypeInput}
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
        <Grid fluid>
          <Row>
            <Col xs={3}>
              {addItemForm}
            </Col>
            <Col xs={9}>
              {itemListForm}
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
  
}
