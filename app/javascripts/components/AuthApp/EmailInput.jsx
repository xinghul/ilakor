"use strict";

import React from "react"
import Input from "lib/Input"

function isValidEmail(email) {
  let validEmailReg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  if (validEmailReg.test(email)) {
    return true;
  }
  
  return false;
}

export default class EmailInput extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isValid: false,
      value: ""
    };
  }
  
  _onEmailChange = (newValue) => {
    let isValid = isValidEmail(newValue);
    
    this.setState({
      isValid: isValid,
      value: newValue
    });
    
    this.props.handleChange(isValid ? newValue : "");
  };
  
  validateEmail() {
    if (!this.state.isValid) {
      if (this.state.value === "") {
        return null;
      }
      
      return "error";
    }
    
    return "success";
  }
  
  getValue() {
    return this.state.value;
  }
  
  render() {
    let validationState = do {
      if (this.props.isRegister) {
        this.validateEmail()
      } else {
        null
      }
    }
    
    let autoComplete = do {
      if (this.props.isRegister) {
        "off"
      } else {
        "email"
      }
    }

    return (
      <Input
        {...this.props}
        type="email"
        placeholder={this.props.placeholder}
        icon="envelope"
        shrink={true}
        validationState={validationState}
        autoComplete={autoComplete}
        onChange={this._onEmailChange} />
    );
  }
};

EmailInput.propTypes = {
  handleChange: React.PropTypes.func,
  placeholder: React.PropTypes.string,
  isRegister: React.PropTypes.bool
};

EmailInput.defaultProps = {
  handleChange: function() {},
  placeholder: "Enter email",
  isRegister: false
};