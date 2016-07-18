"use strict"

import React from "react"
import { Alert } from "react-bootstrap"
import _ from "lodash"

import styles from "lib/AlertMessage.scss"

export default class AlertMessage extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      showAlert: !this.props.hiddenInitially
    };
  }
  
  /**
   * @private
   * Handler for when the Alert emits 'ondismiss' event.
   */
  _onDismiss = () => {
    this.setState({
      showAlert: false
    });
  };
  
  /**
   * Shows the alert message.
   */
  show() {
    this.setState({
      showAlert: true
    });
  }
  
  /**
   * @inheritdoc
   */
  render() {
    
    let classNames = [ styles.alertMessage ];
    
    // push in additional className 
    classNames.push(this.props.className);
    
    let showAlert = this.state.showAlert && 
                    !_.isEmpty(this.props.children);
                    
    let alertStyle = {
      opacity: showAlert ? "1" : "",
      maxHeight: showAlert ? "200px" : ""
    };
    
    return (
      <div style={alertStyle} className={classNames.join(' ')}>
        <Alert bsStyle={this.props.alertStyle} onDismiss={this._onDismiss}>
          {this.props.children}
        </Alert>
      </div>
    );
  }
}

AlertMessage.propTypes = {
  alertStyle: React.PropTypes.oneOf(["success", "warning", "danger", "info"]),
  hiddenInitially: React.PropTypes.bool
};

AlertMessage.defaultProps = {
  alertStyle: "info",
  hiddenInitially: false
};