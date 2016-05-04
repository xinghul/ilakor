"use strict"

import React from "react"
import { Input, Glyphicon, FormControl } from "react-bootstrap"

export default class BaseInput extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  handleChange = () => {
    let newValue = this.refs["input"].getValue();

    this.props.handleChange(newValue);
  };

  render() {
    
    let addonBeforeGlyphicon = null;
    
    if (this.props.addonBefore) {
      addonBeforeGlyphicon = <Glyphicon glyph={this.props.addonBefore} />;
    }
    
    return (
      <div>
        <Input 
          {...this.props}
          addonBefore={addonBeforeGlyphicon}
          spellCheck={false}
          onChange={this.handleChange}
          ref="input"
          />
      </div>
      
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