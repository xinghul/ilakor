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
import AlertMessage from "lib/AlertMessage"

import ImageUploader from "./ImageUploader"

import ItemManageAction from "actions/ItemManageAction"

import styles from "components/ItemManageApp/AddItemForm.scss"

/**
 * Creates the options for tag multiselect.
 * 
 * @param  {Object[]} tags the tags config.
 */
function createTagOptions(tags) {
  
  invariant(_.isArray(tags), `createTagOptions() expects 'tags' as 'array', but get '${typeof tags}'.`);
  
  let tagOptions = [];
  
  for (let tag of tags)
  {
    invariant(_.isString(tag.name), `createTagOptions() expects each tag.name as 'string', but gets '${typeof tag.name}'.`);
    
    tagOptions.push(tag.name);
  }
  
  return tagOptions;
}


export default class AddItemForm extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      isSubmitting: false
    };
  }
  
  /**
   * @private
   * Handler for when the submit button is clicked.
   */
  _handleSubmit = () => {
    let name = this.refs["name"].getValue()
    ,   tag = this.refs["tag"].getValue()
    ,   image = this.refs["image"].getValue()
    ,   price = this.refs["price"].getValue()
    ,   description = this.refs["description"].getHtml();

    if (_.isEmpty(name) || _.isEmpty(tag) || _.isEmpty(image) || 
        _.isEmpty(price) || _.isEmpty(description)) {
      this.refs["alert"].show();
      
      return;
    }
    
    let itemConfig = {
      name: name,
      tag: tag,
      image: image,
      
      price: price,
      
      description: description
      
    };
    
    console.log(itemConfig)
    
    this.setState({
      isSubmitting: true
    });
    
    ItemManageAction.addItem(itemConfig)
      .catch(function(err) {
        console.log(err);
      })
      .finally(() => {
        this._clearForm();
        
        this.setState({
          isSubmitting: false
        });
      });
  };
  
  /**
   * @private
   * Clears the form after submit.
   */
  _clearForm() {
    this.refs["name"].clear();
    this.refs["tag"].clear();
    this.refs["image"].clear();
    this.refs["price"].clear();
    this.refs["description"].clear();
  }
  
  /**
   * @inheritdoc
   */
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
        handleSubmit={this._handleSubmit}
        isSubmitting={this.state.isSubmitting}
        block
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
        <AlertMessage
          ref="alert"
          alertMessage="Empty and/or invalid fields in the form."
          alertStyle="danger"
          hiddenInitially={true}
        />
        <Row>
          <Col xs={12} md={12}>
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
