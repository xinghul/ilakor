"use strict";

import React from "react"
import _ from "lodash"

import BaseInput from "lib/BaseInput"

import styles from "components/AuthApp/PasswordInput.scss"

function isValidPassword(password) {
  let validPasswordReg = /^[a-zA-Z]\w{3,14}$/;

  if (validPasswordReg.test(password)) {
    return true;
  }
  
  return false;
}


export default class PasswordInput extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isValid: false,
      value: ""
    };
  }
  
  handlePasswordChange = (newValue) => {
    let isValid = isValidPassword(newValue);

    this.setState({
      isValid: isValid,
      value: newValue
    });
    
    this.props.handleChange(isValid ? newValue : "");
  };
  
  validatePassword() {
    if (!this.state.isValid) {
      if (this.state.value === "") {
        return null;
      }
      
      return "error";
    }
    
    return "success";
  }
  
  render() {
    let focusText = do {
      if (this.props.isRegister) {
        "First character must be a letter, it must contain at least 4 characters and no more than 15 characters and no characters other than letters, numbers and the underscore may be used"
      } else {
        ""
      }
    }
    
    let validationState = do {
      if (this.props.isRegister) {
        this.validatePassword()
      } else {
        null
      }
    }
    
    return (
      <div className={styles.passwordInput}>
        <BaseInput
          {...this.props}
          type="password"
          placeholder="Enter password"
          icon="lock"
          shrink={true}
          validationState={validationState}
          focusText={focusText}
          autoComplete="off"
          handleChange={this.handlePasswordChange} />
      </div>
    );
  }
};

PasswordInput.propTypes = {
  handleChange: React.PropTypes.func.isRequired,
  isRegister: React.PropTypes.bool
};

PasswordInput.defaultProps = {
  isRegister: false
};