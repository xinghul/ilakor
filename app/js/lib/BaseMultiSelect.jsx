"use strict"

import React from "react"
import { Input } from "react-bootstrap"

export default class BaseMultiSelect extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  handleChange = () => {
    let newValue = this.refs["input"].getValue();
    
    this.props.handleChange(newValue);
  };
  
  createOptions(values) {
    let options = [];
    
    for (let value of values) {
      options.push(
        <option key={value} value={value}>{value}</option>
      );
    }
    
    return options;
  }

  render() {
    
    let options = this.createOptions(this.props.options);

    return (
      <Input 
        type="select" 
        multiple 
        label={this.props.label} 
        onChange={this.handleChange} 
        ref="input">{options}
      </Input>
    );
    
  }
}

BaseMultiSelect.propTypes = {
  options: React.PropTypes.arrayOf(React.PropTypes.string),
  label: React.PropTypes.string,
  handleChange: React.PropTypes.func
};

BaseMultiSelect.defaultProps = {
  options: [],
  label: "",
  handleChange: function() {}
};