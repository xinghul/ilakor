"use strict";

import React from "react"
import BaseInput from "lib/BaseInput.jsx"

function isValidPassword(password) {
  let validPasswordReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i;

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
  
  createBsStyle() {
    if (!this.state.isValid) {
      if (this.state.value === "") {
        return null;
      }
      
      return "error";
    }
    
    return "success";
  }
  
  render() {
    let bsStyle = this.createBsStyle();
    
    return (
      <BaseInput
        type="password"
        placeholder="Password"
        addonBefore="lock"
        bsStyle={bsStyle}
        autoComplete="none"
        handleChange={this.handlePasswordChange} />
    );
  }
};

PasswordInput.propTypes = {
  handleChange: React.PropTypes.func.isRequired
};