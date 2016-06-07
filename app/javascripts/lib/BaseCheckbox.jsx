"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import styles from "lib/BaseCheckbox.scss"

export default class BaseCheckbox extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      checked: false
    };
  }
  
  handleChange = (evt) => {
    let newValue = evt.target.checked;

    this.setState({
      checked: newValue
    });
    
    this.props.handleChange(newValue);
  };
  
  getValue() {
    return this.state.checked;
  }
  
  render() {
    
    return (
      <div className={styles.baseCheckbox}>
        <input 
          type="checkbox" 
          id="baseCheckbox"
          onClick={this.handleChange}
        />
        <label htmlFor="baseCheckbox">{this.props.label}</label>
      </div>
    );
  }
}

BaseCheckbox.propTypes = {
  label: React.PropTypes.string,
  handleChange: React.PropTypes.func
}
BaseCheckbox.defaultProps = {
  label: "Checkbox",
  handleChange: function() {}
};

