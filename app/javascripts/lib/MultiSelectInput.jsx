"use strict"

import React from "react"
import _ from "lodash"
import Select from "react-select"

import styles from "lib/MultiSelectInput.scss"
import reactSelectStyles from "react-select/dist/react-select.min.css"

export default class MultiSelectInput extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      value: []
    };
  }
  
  /**
   * @private
   * Handler for when the select input emits 'change' event.
   * 
   * @param  {Object[]} newValue new select value.
   */
  _onChange = (newValue) => {
    this.setState({
      value: newValue
    });
    
    this.props.onChange(newValue);
  };
  
  /**
   * Returns the selected value as String[].
   * 
   * @return {String[]}
   */
  getValue() {
    return this.state.value.map(function(option) {
      return option.value;
    });
  }
  
  /**
   * Reset the multi select input state.
   */
  clear() {
    this.setState({
      value: []
    });
  }
  
  /**
   * @inheritdoc
   */
  render() {
    
    let options = this.props.options.map((option) => {
      return {
        value: option,
        label: _.capitalize(option)
      };
    });
    
    return (
      <div className={styles.multiSelectInput}>
        <label>
          {this.props.label}
        </label>
        <Select
          {...this.props}
          options={options}
          multi={true}
          value={this.state.value}
          onChange={this._onChange}
        />
      </div>
    );
  }
}

MultiSelectInput.propTypes = {
  options: React.PropTypes.array,
  onChange: React.PropTypes.func
};

MultiSelectInput.defaultProps = {
  options: [],
  onChange: function() {}
};
