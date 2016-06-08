"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import styles from "lib/BaseCheckbox.scss"

export default class BaseCheckbox extends React.Component {
  
  constructor(props) {
    super(props);
    
    this._id = _.uniqueId("baseCheckbox");
    
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
  
  clear() {
    this.setState({
      checked: false
    });
  }
  
  render() {
    
    return (
      <div className={styles.baseCheckbox}>
        <input 
          {...this.props}
          type="checkbox" 
          id={this._id}
          onClick={this.handleChange}
          checked={this.state.checked}
        />
        <label htmlFor={this._id}>{this.props.label}</label>
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

