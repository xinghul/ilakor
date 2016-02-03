import React from "react"
import { Input, Glyphicon } from "react-bootstrap"

+function(undefined) {
"use strict";

var AuthActions = require("../actions/AuthActions");

class BaseAddonInput extends React.component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      value: ''
    };
  }
  
  getValue() {
    return this.refs.input.getValue();
  }
  
  validationState() {
    let value = this.state.value;

    var legalEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    if (value.length > 0) {
      if (legalEmail.test(value)) {
        return "success";
      } else {
        return "error";
      }
    }
  }
  
  handleChange() {
    this.setState({
      value: this.getValue()
    });

    AuthActions.inputEmail(this.getValue());
  }
  
  render() {
    return (
      <Input
        type="email"
        value={this.state.value}
        placeholder="Enter email"
        addonBefore={<Glyphicon glyph="envelope" />}
        help={this.props.emailError}
        bsStyle={this.validationState()}
        hasFeedback
        ref="input"
        groupClassName="group-class"
        labelClassName="label-class"
        onChange={this.handleChange.bind(this)} />
    );
  }

}

BaseAddonInput.propTypes = {
  // type: React.PropTypes.string.isRequired,
  // placeholder: React.PropTypes.string.isRequired,
  // glyph: React.PropTypes.string.isRequired,
  // ref: React.PropTypes.string,
  // groupClassName: React.PropTypes.string,
  // labelClassName: React.PropTypes.string
};

BaseAddonInput.defaultProps = {
  // type: "email",
  // placeholder: "Enter email",
  // glyph: "envelop",
  // ref: "input",
  // groupClassName: "group-class",
  // labelClassName: "label-class"
};

}();

export default BaseAddonInput;
