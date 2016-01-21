+function(undefined) {
  "use strict";

  var React          = require("react")
  ,   ReactBootstrap = require("react-bootstrap");

  // XXX try to make it work with refs
  var AuthActions = require("../../actions/AuthActions");

  var Input = ReactBootstrap.Input;

  const UsernameInput = React.createClass({

    getInitialState: function() {
      return {
        value: ''
      };
    },

    getValue: function() {
      return this.refs.input.getValue();
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

    handleChange: function() {
      // XXX This could also be done using ReactLink:
      // http://facebook.github.io/react/docs/two-way-binding-helpers.html
      this.setState({
        value: this.getValue()
      });

      AuthActions.inputUsername(this.getValue());
    },

    render: function() {
      return (
        <Input
          type="text"
          value={this.state.value}
          placeholder="Enter username"
          label="Username"
          help={this.props.usernameError}
          bsStyle={this.validationState()}
          hasFeedback
          ref="input"
          groupClassName="group-class"
          labelClassName="label-class"
          onChange={this.handleChange} />
      );
    }

  });

  module.exports = UsernameInput;

}();
