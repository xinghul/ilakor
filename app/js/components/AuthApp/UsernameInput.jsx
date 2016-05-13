"use strict";

import React from "react"
import BaseInput from "lib/BaseInput.jsx"

function isValidUsername(username) {
  let validUsernameReg = /^[a-zA-Z0-9]+([_\s\-]?[a-zA-Z0-9])*$/;

  if (validUsernameReg.test(username)) {
    return true;
  }
  
  return false;
}


export default class UsernameInput extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isValid: false,
      value: ""
    };
  }
  
  handleUsernameChange = (newValue) => {
    let isValid = isValidUsername(newValue);

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
        type="text"
        placeholder="Username"
        addonBefore="user"
        bsStyle={bsStyle}
        autoComplete="none"
        handleChange={this.handleUsernameChange} />
    );
  }
};

UsernameInput.propTypes = {
  handleChange: React.PropTypes.func.isRequired
};