import React from "react";
import _ from "lodash";
import invariant from "invariant";

import styles from "lib/Checkbox.scss";

/**
 * @class
 * @extends {React.Component}
 */
export default class Checkbox extends React.Component {
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this._id = _.uniqueId("checkbox");
    
    this.state = {
      checked: this.props.defaultValue
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
    
    const { label, disabled } = this.props;
    const { checked } = this.state;
    
    return (
      <div className={styles.checkbox}>
        <input 
          type="checkbox" 
          disabled={disabled}
          id={this._id}
          onChange={this._onCheckboxChange}
          checked={checked}
        />
        <label htmlFor={this._id}>{label}</label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  label: React.PropTypes.string,
  onChange: React.PropTypes.func,
  disabled: React.PropTypes.bool,
  
  defaultValue: React.PropTypes.bool
}

Checkbox.defaultProps = {
  label: "Checkbox",
  onChange: () => {},
  disabled: false,
  
  defaultValue: false
};

