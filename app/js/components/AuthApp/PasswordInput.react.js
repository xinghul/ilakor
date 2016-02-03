import React from "react"
import { Input, Glyphicon } from "react-bootstrap"

+function(undefined) {
"use strict";

var AuthActions = require("../../actions/AuthActions");

const innerGlyphicon = <Glyphicon glyph="lock" />;

const PasswordInput = React.createClass({

  getInitialState: function() {
    return {
      value: ""
    };
  },

  getValue: function() {
    return this.refs.input.getValue();
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

  handleChange: function() {
    // XXX This could also be done using ReactLink:
    // http://facebook.github.io/react/docs/two-way-binding-helpers.html
    this.setState({
      value: this.getValue()
    });

    AuthActions.inputPassword(this.getValue());
  },

  render: function() {
    return (
      <Input
        type="password"
        value={this.state.value}
        placeholder="Enter password"
        addonBefore={innerGlyphicon}
        help={this.props.passwordError}
        bsStyle={this.validationState()}
        hasFeedback
        ref="input"
        groupClassName="group-class"
        labelClassName="label-class"
        onChange={this.handleChange} />
    );
  }

});

module.exports = PasswordInput;

}();
