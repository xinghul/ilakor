"use strict"

import React from "react"
import _ from "lodash"
import Select from "react-select"

import styles from "lib/MultiSelectInput.scss"
import reactSelectStyles from "react-select/dist/react-select.min.css"

export default class MultiSelectInput extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      value: []
    };
  }
  
  handleChange = (newValue) => {
    this.setState({
      value: newValue
    });
  };
  
  getValue() {
    return this.state.value.map(function(option) {
      return option.value;
    });
  }
  
  render() {
    
    let options = this.props.options.map((option) => {
      return {
        value: option,
        label: _.capitalize(option)
      };
    });
    
    return (
      <Select
        {...this.props}
        options={options}
        multi={true}
        value={this.state.value}
        onChange={this.handleChange}
      />
    );
  }
}

MultiSelectInput.propTypes = {
  options: React.PropTypes.array
};

MultiSelectInput.defaultProps = {
  options: []
};
