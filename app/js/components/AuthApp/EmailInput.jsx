"use strict";

import React from "react"
import BaseInput from "lib/BaseInput.jsx"

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
    
    this.handleEmailChange = this.handleEmailChange.bind(this);
    
    this.state = {
      isValid: false,
      value: ""
    };
  }
  
  handleEmailChange(newValue) {
    let isValid = isValidEmail(newValue);
    
    this.setState({
      isValid: isValid,
      value: newValue
    });
    
    this.props.handleChange(isValid ? newValue : "");
  }
  
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
        type="email"
        placeholder="Email"
        addonBefore="envelope"
        bsStyle={bsStyle}
        handleChange={this.handleEmailChange} />
    );
  }
};

EmailInput.propTypes = {
  handleChange: React.PropTypes.func.isRequired
};