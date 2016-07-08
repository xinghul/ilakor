"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import { Row, Col } from "react-bootstrap"

import BaseInput from "lib/BaseInput"
import MultiSelectInput from "lib/MultiSelectInput"
import SubmitButton from "lib/SubmitButton"
import DraftEditor from "lib/DraftEditor"
import GridSection from "lib/GridSection"

import ImageUploader from "./ImageUploader"

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
    ,   description = this.refs["description"].getHtml();

    if (_.isEmpty(name) || _.isEmpty(tag) || _.isEmpty(image) || 
        _.isEmpty(price) || _.isEmpty(description)) {
      return;
    }
    
    let itemConfig = {
      name: name,
      tag: tag,
      image: image,
      
      price: price,
      
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
        theme="black"
        handleSubmit={this.handleSubmit}
        isSubmitting={this.state.isSubmitting}
      >Add new item</SubmitButton>
    );
    
    return (
      <GridSection title="Add new item" className={styles.addItemForm}>
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
      </GridSection>
    );
  }
}

AddItemForm.propTypes = {
  tags: React.PropTypes.array,
};

AddItemForm.defaultProps = {
  tags: []
};
