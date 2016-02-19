"use strict";

import React from "react"
import { Input, Glyphicon } from "react-bootstrap"
import LinkedStateMixin from "react-addons-linked-state-mixin"

var AuthActions = require("../../actions/AuthActions");

const innerGlyphicon = <Glyphicon glyph="lock" />;

const PasswordInput = React.createClass({
  
  mixins: [LinkedStateMixin],

  getInitialState: function() {
    return {
      value: ""
    };
  },

  validationState: function() {
    let value = this.state.value;

    var minLength = 8
    ,   maxLength = 20
    ,   num       = false
    ,   lower     = false
    ,   upper     = false
    ,   match     = 0;

    var matchNum       = /(?=.*\d)/
    ,   matchLowerCase = /(?=.*[a-z])/
    ,   matchUpperCase = /(?=.*[A-Z])/;


    if (value.length > maxLength || (value.length < minLength && value.length > 0)) {
      return "error";
    } else {
      if (matchNum.test(value)) {
        match++;
        num = true;
      }
      if (matchLowerCase.test(value)) {
        match++;
        lower = true;
      }
      if (matchUpperCase.test(value)) {
        match++;
        upper = true;
      }

      if (match > 2){
        return "success";
      }
      if (match > 0) {
        return "warning";
      }
    }
  },

  handleChange: function(newValue) {
    this.setState({
      value: newValue
    });

    AuthActions.inputPassword(newValue);
  },
  
  render: function() {
    var valueLink = {
      value: this.state.value,
      requestChange: this.handleChange
    };
    
    return (
      <Input
        type="password"
        placeholder="Enter password"
        addonBefore={innerGlyphicon}
        help={this.props.passwordError}
        bsStyle={this.validationState()}
        hasFeedback
        groupClassName="group-class"
        labelClassName="label-class"
        valueLink={valueLink} />
    );
  }

});

module.exports = PasswordInput;
