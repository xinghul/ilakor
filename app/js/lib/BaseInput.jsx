"use strict"

import React from "react"
import { Input, Glyphicon } from "react-bootstrap"

export default class BaseInput extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  handleChange() {
    let newValue = this.refs[this.props.ref].getValue();

    this.props.handleChange(newValue);
  }

  render() {
    
    let addonBeforeGlyphicon = null;
    
    if (this.props.addonBefore) {
      addonBeforeGlyphicon = <Glyphicon glyph={this.props.addonBefore} />;
    }
    
    return (
      <Input 
        type={this.props.type}
        placeholder={this.props.placeholder}
        label={this.props.label}
        addonBefore={addonBeforeGlyphicon}
        onChange={this.handleChange.bind(this)}
        defaultValue={this.props.defaultValue}
        ref="input"
        multiple={this.props.multiple}
        />
    );
    
  }
}

BaseInput.propTypes = { 
  // required props
  type: React.PropTypes.string.isRequired,
  
  // most used props
  handleChange: React.PropTypes.func,
  addonBefore: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  label: React.PropTypes.string,
  defaultValue: React.PropTypes.any,
  ref: React.PropTypes.string,
  multiple: React.PropTypes.bool,
  
  // least used props
  addonAfter: React.PropTypes.string,
  feedbackIcon: React.PropTypes.string,
  groupClassName: React.PropTypes.string,
  labelClassName: React.PropTypes.string
};

BaseInput.defaultProps = {
  handleChange: function() {},
  addonBefore: "",
  placeholder: "",
  label: "",
  defaultValue: "",
  ref: "input",
  multiple: false,

  addonAfter: "",
  feedbackIcon: "",
  groupClassName: "",
  labelClassName: ""
};