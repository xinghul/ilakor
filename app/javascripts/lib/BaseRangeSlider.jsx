"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import styles from "lib/BaseRangeSlider.scss"

export default class BaseRangeSlider extends React.Component {
  
  constructor(props) {
    super(props);
    
    invariant(_.inRange(this.props.defaultValue, this.props.minValue, this.props.maxValue), `The default value ${this.props.defaultValue} should be in range of min value ${this.props.minValue} and max value ${this.props.maxValue}.`)
    
    this.state = {
      value: this.props.defaultValue
    };
  }
  
  handleChange = (evt) => {
    let newValue = evt.target.value;

    this.setState({
      value: newValue
    });
  };
  
  getValue() {
    return this.state.value;
  }
  
  render() {
    
    return (
      <div className={styles.rangeSlider}>
        <input
          className={styles.rangeSliderRange}
          type="range"
          ref={this.props.ref}
          max={this.props.maxValue}
          min={this.props.minValue}
          value={this.state.value}
          onChange={this.handleChange}
        />
        <span className={styles.rangeSliderValue}>{this.state.value}</span>
      </div>
    );
  }
}

BaseRangeSlider.propTypes = {
  defaultValue: React.PropTypes.number,
  maxValue: React.PropTypes.number,
  minValue: React.PropTypes.number,
  
  ref: React.PropTypes.string
};

BaseRangeSlider.defaultProps = {
  defaultValue: 50,
  maxValue: 100,
  minValue: 10,
  
  ref: ""
};
