"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import EmailInput from "./EmailInput"

import SubmitButton from "lib/SubmitButton"
import AlertMessage from "lib/AlertMessage"

import AuthAction from "actions/AuthAction"

import styles from "components/AuthApp/ForgotPasswordApp.scss"

export default class ForgotPasswordApp extends React.Component {
  
  /**
   * @inheritdoc
   */
   constructor(props) {
     super(props);
     
     this.state = {
       email: "",
       
       message: "",
       isSubmitting: false
     };
   }
   
   _onEmailChange = (newValue) => {
     this.setState({
       email: newValue
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
   
   _onSubmitClick = () => {
     this.setState({
       isSubmitting: true
     });
     
     AuthAction.forgotPassword(this.state.email)
       .then((message) => {
         this.setState({
           message: message
         });         
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
  
  /**
   * @inheritdoc
   */
  render() {
    let disabled = _.isEmpty(this.state.email) ||
                   this.state.isSubmitting;
    
    return (
      <div className={styles.forgotPasswordApp}>
        <AlertMessage 
          ref="alert"
          alertStyle="success" 
        >{this.state.message}</AlertMessage>
        <div hidden={!_.isEmpty(this.state.message)}>
          <EmailInput
            value={this.state.email} 
            disabled={this.state.isSubmitting} 
            placeholder="Enter your Cromford email"
            isRegister={false} 
            handleChange={this._onEmailChange} 
          />
          <SubmitButton
            disabled={disabled}
            handleSubmit={this._onSubmitClick}
            isSubmitting={this.state.isSubmitting}
            theme="success"
            block
          >Submit</SubmitButton>
        </div>
        <div className={styles.additionalLinks}>
          <div>Go back to <a onClick={this._onLoginClick}>Log In</a></div>
        </div>
      </div>
    );
  }
}

ForgotPasswordApp.propTypes = {
  setStep: React.PropTypes.func.isRequired
};