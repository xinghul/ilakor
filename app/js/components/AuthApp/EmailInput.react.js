"use strict";

import React from "react"
import { Input, Glyphicon } from "react-bootstrap"
import LinkedStateMixin from "react-addons-linked-state-mixin"

var AuthActions = require("../../actions/AuthActions");

const innerGlyphicon = <Glyphicon glyph="envelope" />;

const EmailInput = React.createClass({
  
  mixins: [LinkedStateMixin],

  getInitialState: function() {
    return {
      value: ''
    };
  },

  validationState: function() {
    let value = this.state.value;

    var legalEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    if (value.length > 0) {
      if (legalEmail.test(value)) {
        return "success";
      } else {
        return "error";
      }
    }
  },

  handleChange: function(newValue) {
    this.setState({
      value: newValue
    });

    AuthActions.inputEmail(newValue);
  },

  render: function() {
    
    var valueLink = {
      value: this.state.value,
      requestChange: this.handleChange
    };

    return (
      <Input
        type="email"
        placeholder="Enter email"
        addonBefore={innerGlyphicon}
        help={this.props.emailError}
        bsStyle={this.validationState()}
        hasFeedback
        groupClassName="group-class"
        labelClassName="label-class"
        valueLink={valueLink} />
    );
  }

});

module.exports = EmailInput;
