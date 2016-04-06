"use strict"

import React from "react"
import { Input, Glyphicon } from "react-bootstrap"

export default class BaseInput extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  handleChange() {
    let newValue = this.refs["input"].getValue();

    this.props.handleChange(newValue);
  }

  render() {
    
    let addonBeforeGlyphicon = null;
    
    if (this.props.addonBefore) {
      addonBeforeGlyphicon = <Glyphicon glyph={this.props.addonBefore} />;
    }
    
    return (
      <Input 
        {...this.props}
        addonBefore={addonBeforeGlyphicon}
        hasFeedback
        spellCheck={false}
        onChange={this.handleChange.bind(this)}
        ref="input"
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
};

BaseInput.defaultProps = {
  handleChange: function() {},
  addonBefore: "",
};