"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import { Row, Col } from "react-bootstrap"

import BaseInput from "lib/BaseInput"
import MultiSelectInput from "lib/MultiSelectInput"
import SubmitButton from "lib/SubmitButton"
import DraftEditor from "lib/DraftEditor"

import ImageUploader from "./ImageUploader"
import DimensionRangeInput from "./DimensionRangeInput"

import ItemManageAction from "actions/ItemManageAction"

import styles from "components/ItemManageApp/AddItemForm.scss"

function createTagOptions(tags) {
  
  invariant(_.isArray(tags), `createTagOptions() expects 'tags' as 'array', but get '${typeof tags}'.`);
  
  let tagOptions = [];
  
  for (let tag of tags)
  {
    tagOptions.push(tag.name);
  }
  
  return tagOptions;
}


export default class AddItemForm extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      isSubmitting: false
    };
  }
  
  handleSubmit = () => {
    let name = this.refs["name"].getValue()
    ,   tag = this.refs["tag"].getValue()
    ,   image = this.refs["image"].getValue()
    ,   price = this.refs["price"].getValue()
    ,   heightValues = this.refs["height"].getValue()
    ,   widthValues = this.refs["width"].getValue()
    ,   depthValues = this.refs["depth"].getValue()
    ,   description = this.refs["description"].getHtml();

    if (_.isEmpty(name) || _.isEmpty(tag) || _.isEmpty(image) || 
        _.isEmpty(price) || _.isEmpty(heightValues) || _.isEmpty(widthValues) || 
        _.isEmpty(depthValues) || _.isEmpty(description)) {
      return;
    }
    
    let itemConfig = {
      name: name,
      tag: tag,
      image: image,
      
      price: price,
      
      dimension: {
        height: {
          ...heightValues
        },
        width: {
          ...widthValues
        },
        depth: {
          ...depthValues
        }
      },
      
      description: description
      
    };
    
    this.setState({
      isSubmitting: true
    });
    
    console.log(itemConfig);
    
    ItemManageAction.addItem(itemConfig)
      .catch(function(err) {
        console.log(err);
      })
      .finally(() => {
        this.clearForm();
        
        this.setState({
          isSubmitting: false
        });
      });
  };
  
  clearForm() {
    this.refs["name"].clear();
    this.refs["tag"].clear();
    this.refs["image"].clear();
    this.refs["price"].clear();
    this.refs["height"].clear();
    this.refs["width"].clear();
    this.refs["depth"].clear();
    this.refs["description"].clear();
  }
  
  render() {
    let nameInput = (
      <BaseInput
        type="text"
        ref="name"
        label="Name"
        placeholder="Enter name"
      />
    );
    
    let tagInput = (
      <MultiSelectInput
        ref="tag"
        label="Tags"
        placeholder="Select tags"
        options={createTagOptions(this.props.tags)}
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
    
    let descriptionEditor = (
      <DraftEditor ref="description" label="Description" />
    );
    
    let submitButton = (
      <SubmitButton
        handleSubmit={this.handleSubmit}
        isSubmitting={this.state.isSubmitting}
      >Add new item</SubmitButton>
    );
    
    return (
      <div className={styles.addItemForm}>
        <Row>
          <Col xs={12} md={8}>
            {nameInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8}>
            {tagInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12}>
            {imagesInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8}>
            {heightInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8}>
            {widthInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8}>
            {depthInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8}>
            {priceInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12}>
            {descriptionEditor}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8}>
            {submitButton}
          </Col>
        </Row>
      </div>
    );
  }
}

AddItemForm.propTypes = {
  tags: React.PropTypes.array,
};

AddItemForm.defaultProps = {
  tags: []
};
