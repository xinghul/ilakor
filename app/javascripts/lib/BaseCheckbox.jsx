"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import styles from "lib/BaseCheckbox.scss"

export default class BaseCheckbox extends React.Component {
  
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
  _onClick = (evt) => {
    let newValue = evt.target.checked;

    this.setState({
      checked: newValue
    });
    
    this.props.onClick(newValue);
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
      <div className={styles.baseCheckbox}>
        <input 
          {...this.props}
          type="checkbox" 
          id={this._id}
          onClick={this._onClick}
          checked={this.state.checked}
        />
        <label htmlFor={this._id}>{this.props.label}</label>
      </div>
    );
  }
}

BaseCheckbox.propTypes = {
  label: React.PropTypes.string,
  onClick: React.PropTypes.func
}

BaseCheckbox.defaultProps = {
  label: "Checkbox",
  onClick: function() {}
};

