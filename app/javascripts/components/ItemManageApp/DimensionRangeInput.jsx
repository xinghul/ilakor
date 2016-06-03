"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import BaseInput from "lib/BaseInput"
import BaseCheckbox from "lib/BaseCheckbox"
import SingleRangeSlider from "lib/SingleRangeSlider"

import styles from "components/ItemManageApp/DimensionRangeInput.scss"

const MIN_BASE_VALUE = 20;

export default class DimensionRangeInput extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      baseValue: 100,
      valueCustomizable: false
    };
  }
  
  handleCustomizableChange = (newValue) => {
    this.setState({
      valueCustomizable: newValue
    });
    
    console.log(this.getValue());
  };
  
  handleBaseValueChange = (newValue) => {
    newValue = Math.max(MIN_BASE_VALUE, _.toInteger(newValue));
    
    this.setState({
      baseValue: newValue
    });
    
    this.updateRangeSliders(newValue);
    
  };
  
  updateRangeSliders(baseValue) {
    let lowerRange = {
      min: Math.max(0, baseValue - 100),
      max: baseValue
    };
    let lowerStart = Math.max(0, baseValue - 20);
    
    let upperRange = {
      min: baseValue,
      max: baseValue + 100,
    };
    let upperStart = baseValue + 20;
    
    this.refs["lowerSlider"].update({
      range: lowerRange,
      start: lowerStart
    });
    
    this.refs["upperSlider"].update({
      range: upperRange,
      start: upperStart
    });
  }
  
  getValue() {
    let value = {
      baseValue: this.state.baseValue,
      valueCustomizable: this.state.valueCustomizable
    };
    
    if (this.state.valueCustomizable) {
      value["minValue"] = this.refs["lowerSlider"].getValue();
      value["maxValue"] = this.refs["upperSlider"].getValue();
    }
    
    return value;
  }
  
  render() {
    
    return (
      <div>
        <div>
          <div className={styles.inputLabel}>{this.props.label}</div>
          <div className={styles.customizableCheckbox}>
            <BaseCheckbox label="customizable" handleChange={this.handleCustomizableChange} />
          </div>
        </div>
        <div className={styles.inputGroup}>
          <div hidden={!this.state.valueCustomizable} className={styles.rangeSlider}>
            <SingleRangeSlider connect="upper" ref="lowerSlider" />
          </div>
          <div className={styles.baseValueInput}>
            <BaseInput
              type="text"
              handleChange={this.handleBaseValueChange}
            />
          </div>
          <div hidden={!this.state.valueCustomizable} className={styles.rangeSlider}>
            <SingleRangeSlider connect="lower" ref="upperSlider" />
          </div>
        </div>
      </div>
    );
    
  }
}

DimensionRangeInput.propTypes = {
  label: React.PropTypes.string
};

DimensionRangeInput.defaultProps = {
  label: "Dimension"
};
