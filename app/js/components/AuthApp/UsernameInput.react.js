"use strict";

import React from "react"
import { Input, Glyphicon } from "react-bootstrap"
import LinkedStateMixin from "react-addons-linked-state-mixin"

var AuthActions = require("../../actions/AuthActions");

const innerGlyphicon = <Glyphicon glyph="user" />;

const UsernameInput = React.createClass({
  
  mixins: [LinkedStateMixin],

  getInitialState: function() {
    return {
      value: ''
    };
  },

  validationState: function() {
    var legalUserReg = /^[a-zA-Z][a-zA-Z0-9]*$/
    ,   minLength    = 4
    ,   maxLength    = 20;

    let value  = this.state.value;

    if (value.length > 0) {
      if (value.length > maxLength || value.length < minLength) {
        return "error";
      } else if (!legalUserReg.test(value)) {
        return "error";
      } else {
        return "success";
      }
    }
  },

  handleChange: function(newValue) {
    this.setState({
      value: newValue
    });

    AuthActions.inputUsername(newValue);
  },

  render: function() {
    
    var valueLink = {
      value: this.state.value,
      requestChange: this.handleChange
    };
    
    return (
      <Input
        type="text"
        placeholder="Enter username"
        addonBefore={innerGlyphicon}
        help={this.props.usernameError}
        bsStyle={this.validationState()}
        hasFeedback
        groupClassName="group-class"
        labelClassName="label-class"
        valueLink={valueLink} />
    );
  }

});

module.exports = UsernameInput;
