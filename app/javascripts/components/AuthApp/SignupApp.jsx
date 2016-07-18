"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"
import { Form } from "react-bootstrap"

import EmailInput from "./EmailInput"
import UsernameInput from "./UsernameInput"
import PasswordInput from "./PasswordInput"

import SubmitButton from "lib/SubmitButton"
import AlertMessage from "lib/AlertMessage"

import AuthAction from "actions/AuthAction"

import styles from "components/AuthApp/SignupApp.scss"

export default class SignupApp extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      email: "",
      username: "",
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
   * Handler for when username input value changes.
   * @param  {String} newValue the new username value.
   */
  _onUsernameChange = (newValue) => {
    this.setState({
      username: newValue
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
   * Handler for when the login link is clicked.
   */
  _onLoginClick = () => {
    this.setState({
      errorMessage: "",
    });
    
    this.props.setStep(1);
  };
  
  /**
   * @private
   * 
   * Handler for when the sign up button is clicked.
   */
  _onSignupClick = () => {
    
    this.setState({
      isSubmitting: true
    });
    
    AuthAction.userSignUp({

      username: this.state.username,
      email: this.state.email,
      password: this.state.password

    }).then(() => {
      AuthAction.hideModal();
    }).catch((err) => {
      console.log(err);
      
      let message = err.message;
      
      invariant(_.isString(message), `Expect error message to be 'string', but get '${typeof message}'.`);
      
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
                   _.isEmpty(this.state.username) ||
                   _.isEmpty(this.state.password) ||
                   this.state.isSubmitting;

    return (
      <div className={styles.signupApp}>
        <Form>
          <EmailInput value={this.state.email} disabled={this.state.isSubmitting} isRegister={true} handleChange={this._onEmailChange} />
          <UsernameInput value={this.state.username} disabled={this.state.isSubmitting} isRegister={true} handleChange={this._onUsernameChange} />
          <PasswordInput value={this.state.password} disabled={this.state.isSubmitting} isRegister={true} handleChange={this._onPasswordChange} />
        </Form>
        <AlertMessage 
          ref="alert"
          alertStyle="danger" 
        >{this.state.errorMessage}</AlertMessage>
        <SubmitButton
          theme="success"
          disabled={disabled}
          handleSubmit={this._onSignupClick}
          isSubmitting={this.state.isSubmitting}
          block
        >Sign up</SubmitButton>
        <div className={styles.additionalLinks}>
          <div>Already have an account? <a onClick={this._onLoginClick}>Log In</a></div>
        </div>
      </div>
    );
  }
}

SignupApp.propTypes = {
  setStep: React.PropTypes.func.isRequired
};