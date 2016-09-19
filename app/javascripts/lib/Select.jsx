"use strict"

import React from "react"
import _ from "lodash"
import ReactSelect from "react-select"

import styles from "lib/Select.scss"
import reactSelectStyles from "react-select/dist/react-select.min.css"

export default class Select extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      value: this.props.multi ? [] : {}
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
   * Returns the selected value as String[], if multi select is enabled.
   * 
   * @return {String[]}
   */
  getValue() {
    const { value } = this.state;
    
    if (_.isArray(value)) {
      return value.map((option) => {
        return option.value;
      });      
    } else if (!_.isEmpty(value)) {
      return value.value;
    }
    
    return null;
  }
  
  /**
   * Reset the multi select input state.
   */
  clear() {
    this.setState({
      value: this.props.multi ? [] : {}
    });
  }
  
  /**
   * @inheritdoc
   */
  render() {
    
    const { label, multi, options, placeholder } = this.props;
    
    let selectOptions = options.map((option) => {
      return {
        value: option._id,
        label: _.capitalize(option.name)
      };
    });

    return (
      <div className={styles.select}>
        <label>
          {label}
        </label>
        <ReactSelect
          placeholder={placeholder}
          options={selectOptions}
          multi={multi}
          value={this.state.value}
          onChange={this._onChange}
        />
      </div>
    );
  }
}

Select.propTypes = {
  options: React.PropTypes.array,
  multi: React.PropTypes.bool,

  label: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  onChange: React.PropTypes.func
};

Select.defaultProps = {
  options: [],
  multi: true,

  label: "",
  placeholder: "",
  onChange: () => {}
};
