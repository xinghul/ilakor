import React from "react";
import _ from "lodash";
import invariant from "invariant";

import { Row, Col } from "react-bootstrap";

import Input from "lib/Input";
import GhostButton from "lib/GhostButton";
import Select from "lib/Select";
import SubmitButton from "lib/SubmitButton";
import DraftEditor from "lib/DraftEditor";
import GridSection from "lib/GridSection";
import AlertMessage from "lib/AlertMessage";

import ImageUploader from "./ImageUploader";

import ItemManageAction from "actions/item/ItemManageAction";

import styles from "components/ManageApp/ItemManageApp/AddItemForm.scss";

/**
 * Creates the options for Select component.
 * 
 * @method createSelectOptions
 * 
 * @param  {Array} data the items used for creating the options.
 * 
 * @return {Array}
 */
function createSelectOptions(data) {
  return _.map(data, (dataItem) => {
    return {
      label: _.capitalize(dataItem.name),
      value: dataItem._id
    };
  });
}

export default class AddItemForm extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      isSubmitting: false,
      
      featureCount: 1
    };
  }
  
  /**
   * @inheritdoc
   */
  render() {
    let nameInput = (
      <Input
        ref="name"
        label="Name"
        placeholder="Enter name"
      />
    );
    
    let brandInput = (
      <Select
        multi={false}
        ref="brand"
        label="Brand"
        placeholder="Select brand"
        options={createSelectOptions(this.props.brands)}
      />
    );
    
    let categoryInput = (
      <Select
        multi={false}
        ref="category"
        label="Category"
        placeholder="Select category"
        options={createSelectOptions(this.props.categories)}
      />
    );
    
    let tagInput = (
      <Select
        ref="tags"
        label="Tags"
        placeholder="Select tags"
        options={createSelectOptions(this.props.tags)}
      />
    );
    
    let featureInput = this._createFeatureInputJsx();
    
    let imagesInput = (
      <ImageUploader ref="image" />
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
          <Col xs={12} md={12}>
            {nameInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12}>
            {brandInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12}>
            {categoryInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12}>
            {tagInput}
          </Col>
        </Row>
        {featureInput}
        <Row>
          <Col xs={12} md={12}>
            {imagesInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12}>
            {descriptionEditor}
          </Col>
        </Row>
        <AlertMessage
          ref="alert"
          alertStyle="danger"
          hiddenInitially={true}
        >Empty and/or invalid fields in the form.</AlertMessage>
        <Row>
          <Col xs={12} md={12}>
            {submitButton}
          </Col>
        </Row>
      </GridSection>
    );
  }
  
  /**
   * @private
   * Handler for when the submit button is clicked.
   */
  _handleSubmit = () => {
    
    const { featureCount } = this.state;
    
    let name = this.refs["name"].getValue()
    ,   brand = this.refs["brand"].getValue()
    ,   category = this.refs["category"].getValue()
    ,   tags = this.refs["tags"].getValue()
    ,   image = this.refs["image"].getValue()
    ,   description = this.refs["description"].getHtml();

    if (_.isEmpty(name) || _.isEmpty(brand) || _.isEmpty(category) || _.isEmpty(tags) || 
        _.isEmpty(image) || _.isEmpty(description)) {
      this.refs["alert"].show();
      
      return;
    }
    
    let features = [];
    _.times(featureCount, (index) => {
      let key = this.refs[`featureKey${index}`].getValue()
      ,   value = this.refs[`featureValue${index}`].getValue();
      
      if (!_.isEmpty(key) && !_.isEmpty(value)) {
        features.push({
          key,
          value
        });
      }
    });
    
    let itemConfig = {
      name,
      brand,
      category,
      tags,
      features,
      image,
    
      description
      
    };
    
    console.log(itemConfig)
    
    this.setState({
      isSubmitting: true
    });
    
    ItemManageAction.addItem(itemConfig)
      .catch((err) => {
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
    this.refs["brand"].clear();
    this.refs["category"].clear();
    this.refs["tags"].clear();
    this.refs["image"].clear();
    this.refs["description"].clear();
    
    this.setState({
      featureCount: 1
    });
  }
  
  /**
   * @private
   * Handler for add feature button click.
   */
  _onAddFeatureClick = () => {
    const { featureCount } = this.state;
    
    this.setState({
      featureCount: featureCount + 1
    });
  };
  
  /**
   * @private
   * Creates the feature input group JSX.
   * 
   * @return {JSX}
   */
  _createFeatureInputJsx() {
    const { featureCount } = this.state;
    
    let featureInput = [];
    
    _.times(featureCount, (index) => {
      featureInput.push(
        <Row key={_.uniqueId("feature")}>
          <Col md={6} xs={6}>
            <Input
              ref={`featureKey${index}`}
              placeholder="Key"
            />
          </Col>
          <Col md={6} xs={6}>
            <Input
              ref={`featureValue${index}`}
              placeholder="Value"
            />
          </Col>
        </Row>
      );
    });
    
    featureInput.push(
      <GhostButton
        key="addFeatureButton"
        theme="black" 
        onClick={this._onAddFeatureClick}
      >
        Add feature
      </GhostButton>
    );
    
    return featureInput;
  }
}

AddItemForm.propTypes = {
  tags: React.PropTypes.array,
  categories: React.PropTypes.array,
  brands: React.PropTypes.array
};

AddItemForm.defaultProps = {
  tags: [],
  categories: [],
  brands: []
};
