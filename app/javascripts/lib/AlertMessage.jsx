"use strict"

import React from "react"
import { Alert } from "react-bootstrap"
import _ from "lodash"

import styles from "lib/AlertMessage.scss"

export default class AlertMessage extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      showAlert: true
    };
  }
  
  handleAlertDismiss = () => {
    this.setState({
      showAlert: false
    });
  };
  
  showAlert() {
    this.setState({
      showAlert: true
    });
  }
  
  render() {
    
    let showAlert = this.state.showAlert && 
                    !_.isEmpty(this.props.alertMessage);
                    
    let alertStyle = {
      opacity: showAlert ? "1" : "",
      maxHeight: showAlert ? "200px" : ""
    };
    
    return (
      <div style={alertStyle} className={styles.alertMessage}>
        <Alert bsStyle={this.props.alertStyle} onDismiss={this.handleAlertDismiss}>
          <p>{this.props.alertMessage}</p>
        </Alert>
      </div>
    );
  }
}

AlertMessage.propTypes = {
  alertMessage: React.PropTypes.string,
  alertStyle: React.PropTypes.oneOf(["success", "warning", "danger", "info"])
};

AlertMessage.defaultProps = {
  alertMessage: "",
  alertStyle: "info"
};