"use strict"

import React from "react"
import _ from "lodash"
import { hashHistory } from "react-router"

import styles from "components/ResetPasswordApp.scss"

import AuthAction from "actions/AuthAction"

import SubmitButton from "lib/SubmitButton"
import BlurMask from "lib/BlurMask"
import AlertMessage from "lib/AlertMessage"

import PasswordInput from "components/AuthApp/PasswordInput"

function getQueryString(field) {
  let href = window.location.href;
  let reg = new RegExp("[?&]" + field + "=([^&#]*)", 'i' );
  let string = reg.exec(href);
  return string ? string[1] : null;
};

export default class ResetPasswordApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      password: "",
      message: "",
      isSubmitting: false
    };
  }
  
  componentDidMount() {
    
  }

  handlePasswordChange = (newValue) => {
    this.setState({
      password: newValue
    });
  };
  
  handleSubmitClick = () => {
    this.setState({
      isSubmitting: true
    });
    
    let token = getQueryString("token");

    AuthAction.resetPassword(token, this.state.password)
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
    let disabled = _.isEmpty(this.state.password) ||
                   this.state.isSubmitting;
    
    let showSuccessMessage = !_.isEmpty(this.state.message);   

    return (
      <div className={styles.resetPasswordApp}>
        <BlurMask />
        <div className={styles.formContent}>
          <label className={styles.formTitle}>Reset password</label>
          <AlertMessage 
            alertMessage={this.state.message} 
            alertStyle="success" 
          />
          <div hidden={showSuccessMessage}>
            <PasswordInput value={this.state.password} disabled={this.state.isSubmitting} isRegister={true} handleChange={this.handlePasswordChange} />
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
