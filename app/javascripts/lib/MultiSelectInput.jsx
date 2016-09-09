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
    
    const { label, options, placeholder } = this.props;
    
    let selectOptions = options.map((option) => {
      return {
        value: option,
        label: _.capitalize(option)
      };
    });

    return (
      <div className={styles.multiSelectInput}>
        <label>
          {label}
        </label>
        <Select
          placeholder={placeholder}
          options={selectOptions}
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

  label: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  onChange: React.PropTypes.func
};

MultiSelectInput.defaultProps = {
  options: [],

  label: "",
  placeholder: "",
  onChange: () => {}
};
