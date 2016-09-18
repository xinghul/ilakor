import React from "react";
import _ from "lodash";
import invariant from "invariant";

import { Row, Col } from "react-bootstrap";

import Input from "lib/Input";
import SubmitButton from "lib/SubmitButton";
import GridSection from "lib/GridSection";
import AlertMessage from "lib/AlertMessage";

import CategoryManageAction from "actions/item/CategoryManageAction";

import styles from "components/ManageApp/CategoryManageApp/AddCategoryForm.scss";


export default class AddCategoryForm extends React.Component {
  
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
    
    CategoryManageAction.addCategory(name)
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
        placeholder="Enter tag name"
      />
    );
    
    let submitButton = (
      <SubmitButton
        theme="black"
        handleSubmit={this._handleSubmit}
        isSubmitting={this.state.isSubmitting}
        block
      >Add new category</SubmitButton>
    );
    
    return (
      <GridSection title="Add new category" className={styles.addCategoryForm}>
        <Row>
          <Col xs={12} md={8}>
            {nameInput}
          </Col>
        </Row>
        <AlertMessage
          ref="alert"
          alertStyle="danger"
          hiddenInitially={true}
        >Empty and/or invalid category name.</AlertMessage>
        <Row>
          <Col xs={12} md={12}>
            {submitButton}
          </Col>
        </Row>
      </GridSection>
    );
  }
}