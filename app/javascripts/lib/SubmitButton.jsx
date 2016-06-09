"use strict";

import React from "react"

import { Button } from "react-bootstrap"

import BaseSpinner from "lib/BaseSpinner"

import styles from "lib/SubmitButton.scss"

export default class SubmitButton extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    
    return (
      <Button disabled={this.props.isSubmitting} 
        onClick={this.props.handleSubmit}
        className={styles.submitButton} 
        bsSize="large" 
        block
        {...this.props}
      >
        <div hidden={!this.props.isSubmitting} className={styles.spinner}>
          <BaseSpinner />
        </div>
        <div hidden={this.props.isSubmitting}>
          {this.props.children}
        </div>
      </Button>
      
    );
  }
}

SubmitButton.propTypes = {
  isSubmitting: React.PropTypes.bool,
  handleSubmit: React.PropTypes.func
};

SubmitButton.defaultProps = {
  isSubmitting: false,
  handleSubmit: function() {}
};
