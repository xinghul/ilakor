import React from "react";
import _ from "lodash";
import invariant from "invariant";

import { Row, Col } from "react-bootstrap";

import Input from "lib/Input";
import SubmitButton from "lib/SubmitButton";
import GridSection from "lib/GridSection";
import AlertMessage from "lib/AlertMessage";

import BrandManageAction from "actions/item/BrandManageAction";

import styles from "components/ManageApp/BrandManageApp/AddBrandForm.scss";


export default class AddBrandForm extends React.Component {
  
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
    let name = this.refs["name"].getValue();

    if (_.isEmpty(name)) {
      this.refs["alert"].show();
      
      return;
    }
    
    this.setState({
      isSubmitting: true
    });
    
    BrandManageAction.addBrand(name)
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
  }
  
  /**
   * @inheritdoc
   */
  render() {
    let nameInput = (
      <Input
        ref="name"
        label="Name"
        placeholder="Enter brand name"
      />
    );
    
    let submitButton = (
      <SubmitButton
        theme="black"
        handleSubmit={this._handleSubmit}
        isSubmitting={this.state.isSubmitting}
        block
      >Add new brand</SubmitButton>
    );
    
    return (
      <GridSection title="Add new brand" className={styles.addBrandForm}>
        <Row>
          <Col xs={12} md={8}>
            {nameInput}
          </Col>
        </Row>
        <AlertMessage
          ref="alert"
          alertStyle="danger"
          hiddenInitially={true}
        >Empty and/or invalid brand name.</AlertMessage>
        <Row>
          <Col xs={12} md={12}>
            {submitButton}
          </Col>
        </Row>
      </GridSection>
    );
  }
}