"use strict"

import React from "react"
import _ from "lodash"
import { Alert } from "react-bootstrap"
import { hashHistory } from "react-router"

import styles from "components/ForgotPasswordApp.scss"

import AuthAction from "actions/AuthAction"

import SubmitButton from "lib/SubmitButton"
import BlurMask from "lib/BlurMask"
import EmailInput from "components/AuthApp/EmailInput"

export default class ForgotPasswordApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      email: "",
      message: "",
      isSubmitting: false
    };
  }
  
  handleEmailChange = (newValue) => {
    this.setState({
      email: newValue
    });
  };
  
  handleSubmitClick = () => {
    this.setState({
      isSubmitting: true
    });
    
    AuthAction.forgotPassword(this.state.email)
      .then((message) => {
        this.setState({
          message: message
        });
        
        setTimeout(() => {
          hashHistory.push("/");
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({
          isSubmitting: false
        });
      });
  };

  render() {
    let disabled = _.isEmpty(this.state.email) ||
                   this.state.isSubmitting;
    
    let showSuccessMessage = !_.isEmpty(this.state.message);   
    let messageStyle = {
      opacity: showSuccessMessage ? "1" : "",
      maxHeight: showSuccessMessage ? "52px" : "",
      marginBottom: showSuccessMessage ? "20px" : ""
    };

    return (
      <div className={styles.forgotPasswordApp}>
        <BlurMask />
        <div className={styles.formContent}>
          <label className={styles.formTitle}>Forgot password</label>
          <div style={messageStyle} className={styles.successMessage}>
            <Alert bsStyle="success">
              <p>{this.state.message}</p>
            </Alert>
          </div>
          <div hidden={showSuccessMessage}>
            <EmailInput
              value={this.state.email} 
              disabled={this.state.isSubmitting} 
              placeholder="Enter the email you use to sign in to Cromford"
              isRegister={false} 
              handleChange={this.handleEmailChange} 
            />
            <SubmitButton
              disabled={disabled}
              handleSubmit={this.handleSubmitClick}
              isSubmitting={this.state.isSubmitting}
              theme="success"
            >Submit</SubmitButton>
          </div>
        </div>
      </div>
    );
    
  }

}
