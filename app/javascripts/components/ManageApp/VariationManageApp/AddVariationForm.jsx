import React from "react";
import _ from "lodash";
import invariant from "invariant";

import { Row, Col } from "react-bootstrap";

import Select from "lib/Select";
import Input from "lib/Input";
import SubmitButton from "lib/SubmitButton";
import GridSection from "lib/GridSection";
import AlertMessage from "lib/AlertMessage";

import VariationManageAction from "actions/item/VariationManageAction";

import styles from "components/ManageApp/VariationManageApp/AddVariationForm.scss";


export default class AddVariationForm extends React.Component {
  
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
    let item = this.refs["item"].getValue()
    ,   flavor = this.refs["flavor"].getValue()
    ,   size = this.refs["size"].getValue()
    ,   price = this.refs["price"].getValue();

    if (_.isEmpty(item) || _.isEmpty(flavor) || _.isEmpty(size) || _.isEmpty(price)) {
      this.refs["alert"].show();
      
      return;
    }
    
    let newVariation = {
      item,
      info: {
        flavor,
        size
      },
      price
    };
        
    this.setState({
      isSubmitting: true
    });
    
    VariationManageAction.addVariation(newVariation)
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
    this.refs["item"].clear();
    this.refs["flavor"].clear();
    this.refs["size"].clear();
    this.refs["price"].clear();
  }
  
  /**
   * @inheritdoc
   */
  render() {
    
    let itemInput = (
      <Select
        multi={false}
        ref="item"
        label="Item"
        placeholder="Select item"
        options={this.props.items}
      />
    );
    
    let flavorInput = (
      <Input
        ref="flavor"
        label="Flavor"
        placeholder="Enter flavor"
      />
    );
    
    let sizeInput = (
      <Input
        ref="size"
        label="Size"
        placeholder="Enter size"
      />
    );
    
    let priceInput = (
      <Input
        ref="price"
        label="Price"
        placeholder="Enter price"
      />
    );
    
    let submitButton = (
      <SubmitButton
        theme="black"
        handleSubmit={this._handleSubmit}
        isSubmitting={this.state.isSubmitting}
        block
      >Add new variation</SubmitButton>
    );
    
    return (
      <GridSection title="Add new variation" className={styles.addVariationForm}>
        <Row>
          <Col xs={12} md={8}>
            {itemInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8}>
            {flavorInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8}>
            {sizeInput}
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={8}>
            {priceInput}
          </Col>
        </Row>
        <AlertMessage
          ref="alert"
          alertStyle="danger"
          hiddenInitially={true}
        >Empty and/or invalid variation name.</AlertMessage>
        <Row>
          <Col xs={12} md={12}>
            {submitButton}
          </Col>
        </Row>
      </GridSection>
    );
  }
}

AddVariationForm.propTypes = {
  items: React.PropTypes.array
};

AddVariationForm.defaultProps = {
  items: []
};