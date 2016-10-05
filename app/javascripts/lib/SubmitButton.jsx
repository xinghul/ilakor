import React from "react";
import _ from "lodash";

import LoadSpinner from "lib/LoadSpinner";
import GhostButton from "lib/GhostButton";

import styles from "lib/SubmitButton.scss";

/**
 * @class
 * @extends {React.Component}
 */
export default class SubmitButton extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
  }
  
  /**
   * @inheritdoc
   */
  render() {
    
    let buttonProps = _.clone(this.props);
    
    delete buttonProps.isSubmitting;
    delete buttonProps.submitText;
    delete buttonProps.handleSubmit;

    // put {...this.props} behind disabled, so it can't be overriden
    return (
      <GhostButton
        disabled={this.props.isSubmitting} 
        {...buttonProps}
        onClick={this.props.handleSubmit}
        className={styles.submitButton} 
        bsSize="large" 
      >
        <LoadSpinner className={styles.spinner} size={40} hidden={!this.props.isSubmitting} text={this.props.submitText} />
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
  handleSubmit: () => {}
};
