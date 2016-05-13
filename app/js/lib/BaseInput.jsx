"use strict"

import React from "react"
import { FormGroup, Glyphicon, FormControl } from "react-bootstrap"

export default class BaseInput extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  handleChange = (evt) => {
    let newValue = evt.target.value;

    this.props.handleChange(newValue);
  };

  render() {
    
    let addonBeforeGlyphicon = null;
    
    if (this.props.addonBefore) {
      addonBeforeGlyphicon = <Glyphicon glyph={this.props.addonBefore} />;
    }
    
    return (
      <FormGroup>
        <FormControl 
          {...this.props}
          addonBefore={addonBeforeGlyphicon}
          onChange={this.handleChange} />
      </FormGroup>
      
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