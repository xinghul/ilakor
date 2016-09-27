import React from "react";
import _ from "lodash";
import ReactSelect from "react-select";

import styles from "lib/Select.scss";
import reactSelectStyles from "react-select/dist/react-select.min.css";

/**
 * Extracts the selected value as array|string, so it can be consumed by other apps.
 * 
 * @param  {Object[]}     rawValue the raw selected value.
 * 
 * @return {String[] | String}
 */
function extractValue(rawValue) {
  if (_.isArray(rawValue)) {
    return rawValue.map((option) => {
      return option.value;
    });      
  } else if (!_.isEmpty(rawValue)) {
    return rawValue.value;
  }
  
  return null;
}

/**
 * @class
 * @extends {React.Component}
 */
export default class Select extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      value: _.isEmpty(this.props.defaultValue) ? null
                                                : this.props.defaultValue
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
    
    this.props.onChange(extractValue(newValue));
  };
  
  /**
   * Returns the selected value as String[], if multi select is enabled.
   * 
   * @return {String[]}
   */
  getValue() {
    const { value } = this.state;
    
    return extractValue(value);
  }
  
  /**
   * Reset the multi select input state.
   */
  clear() {
    this.setState({
      value: null
    });
  }
  
  /**
   * @inheritdoc
   */
  render() {
    
    const { label, multi, options, placeholder } = this.props;
    
    return (
      <div className={styles.select}>
        <label>
          {label}
        </label>
        <ReactSelect
          placeholder={placeholder}
          options={options}
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
  onChange: React.PropTypes.func,
  
  defaultValue: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.arrayOf(React.PropTypes.string)
  ])
};

Select.defaultProps = {
  options: [],
  multi: true,

  label: "",
  placeholder: "",
  onChange: () => {},
  
  defaultValue: null
};
