"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"
import { Form } from "react-bootstrap"

import EmailInput from "./EmailInput"
import PasswordInput from "./PasswordInput"

import SubmitButton from "lib/SubmitButton"
import AlertMessage from "lib/AlertMessage"

import AuthAction from "actions/AuthAction"

import styles from "components/AuthApp/LoginApp.scss"

export default class LoginApp extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      email: "",
      password: "",
      
      errorMessage: "",
      isSubmitting: false
    };
  }
  
  /**
   * @private
   * 
   * Handler for when email input value changes.
   * @param  {String} newValue the new email value.
   */
  _onEmailChange = (newValue) => {
    this.setState({
      email: newValue
    });
  };
  
  /**
   * @private
   * 
   * Handler for when password input value changes.
   * @param  {String} newValue the new password value.
   */
  _onPasswordChange = (newValue) => {
    this.setState({
      password: newValue
    });
  };
  
  /**
   * @private
   * 
   * Handler for when the forgot password link is clicked.
   */
  _onForgotPasswordClick = () => {
    this.setState({
      errorMessage: "",
    });

    this.props.setStep(3);
  };
  
  /**
   * @private
   * 
   * Handler for when the sign up link is clicked.
   */
  _onSignupClick = () => {
    this.setState({
      errorMessage: "",
    });
    
    this.props.setStep(2);
  };
  
  /**
   * @private
   * 
   * Handler for when the login button is clicked.
   */
  _onLoginClick = () => {
    
    this.setState({
      isSubmitting: true
    });
    
    AuthAction.logIn({

      email: this.state.email,
      password: this.state.password

    }).then(() => {
      AuthAction.hideModal();
    }).catch((message) => {
      
      this.setState({
        errorMessage: message
      });
      
      this.refs["alert"].show();
    }).finally(() => {
      this.setState({
        isSubmitting: false
      });
    });
  };
  
  /**
   * @inheritdoc
   */
  render() {
    
    let disabled = _.isEmpty(this.state.email) ||
                   _.isEmpty(this.state.password) || 
                   this.state.isSubmitting;
    
    return (
      <div className={styles.loginApp}>
        <Form>
          <EmailInput value={this.state.email} disabled={this.state.isSubmitting} isRegister={false} handleChange={this._onEmailChange} />
          <PasswordInput value={this.state.password} disabled={this.state.isSubmitting} isRegister={false} handleChange={this._onPasswordChange} />
        </Form>
        <AlertMessage 
          ref="alert"
          alertStyle="danger" 
        >{this.state.errorMessage}</AlertMessage>
        <SubmitButton
          theme="success"
          disabled={disabled}
          handleSubmit={this._onLoginClick}
          isSubmitting={this.state.isSubmitting}
          block
        >Log in</SubmitButton>
        <div className={styles.additionalLinks}>
          <a onClick={this._onForgotPasswordClick}>Forgot password?</a>
          <div className={styles.signupLink}>New here? <a onClick={this._onSignupClick}>Sign Up</a></div>
        </div>
      </div>
    );
  }
}

LoginApp.propTypes = {
  setStep: React.PropTypes.func.isRequired
};