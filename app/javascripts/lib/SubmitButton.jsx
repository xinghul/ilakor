"use strict";

import React from "react"

import BaseSpinner from "lib/BaseSpinner"
import GhostButton from "lib/GhostButton"

import styles from "lib/SubmitButton.scss"

export default class SubmitButton extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {

    // put {...this.props} behind disabled, so it can't be overriden
    return (
      <GhostButton
        disabled={this.props.isSubmitting} 
        {...this.props}
        onClick={this.props.handleSubmit}
        className={styles.submitButton} 
        bsSize="large" 
      >
        <div hidden={!this.props.isSubmitting} className={styles.spinner}>
          <BaseSpinner text={this.props.submitText} />
        </div>
        <div hidden={this.props.isSubmitting}>
          {this.props.children}
        </div>
      </GhostButton>
    );
  }
}

SubmitButton.propTypes = {
  isSubmitting: React.PropTypes.bool,
  submitText: React.PropTypes.string,
  handleSubmit: React.PropTypes.func
};

SubmitButton.defaultProps = {
  isSubmitting: false,
  submitText: "",
  handleSubmit: function() {}
};
