"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import styles from "lib/Checkbox.scss"

export default class Checkbox extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this._id = _.uniqueId("baseCheckbox");
    
    this.state = {
      checked: false
    };
  }
  
  /**
   * @private
   * Handler for when checkbox is clicked.
   * 
   * @param  {Object} evt the click event object.
   */
  _onCheckboxChange = (evt) => {
    let newValue = evt.target.checked;

    this.setState({
      checked: newValue
    });
    
    this.props.onChange(newValue);
  };
  
  /**
   * Returns the checked state of the checkbox.
   * 
   * @return {Boolean}
   */
  getValue() {
    return this.state.checked;
  }
  
  /**
   * Resets the checkbox state.
   */
  clear() {
    this.setState({
      checked: false
    });
  }
  
  /**
   * @inheritdoc
   */
  render() {
    
    return (
      <div className={styles.checkbox}>
        <input 
          {...this.props}
          type="checkbox" 
          id={this._id}
          onChange={this._onCheckboxChange}
          checked={this.state.checked}
        />
        <label htmlFor={this._id}>{this.props.label}</label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  label: React.PropTypes.string,
  onChange: React.PropTypes.func
}

Checkbox.defaultProps = {
  label: "Checkbox",
  onChange: function() {}
};

