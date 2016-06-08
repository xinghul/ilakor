"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import { Form, FormGroup, InputGroup, ControlLabel, Row, Col } from "react-bootstrap"

import BaseInput from "lib/BaseInput"
import BaseCheckbox from "lib/BaseCheckbox"
import SingleRangeSlider from "lib/SingleRangeSlider"

import styles from "components/ItemManageApp/DimensionRangeInput.scss"

const validBaseValueReg = /^\d*[1-9]\d*$/;

function validateBaseValue(baseValue) {

  if (_.isEmpty(baseValue)) {
    return;
  }

  if (validBaseValueReg.test(baseValue)) {
    return "success";
  }
  
  return "error";
}

export default class DimensionRangeInput extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      baseValue: "",
      validBaseValue: false,
      valueCustomizable: false
    };
  }
  
  handleCustomizableChange = (newValue) => {
    this.setState({
      valueCustomizable: newValue
    });
  };
  
  handleBaseValueChange = (newValue) => {
    this.setState({
      baseValue: newValue
    });
    
    if (!validBaseValueReg.test(newValue)) {
      this.setState({
        validBaseValue: false
      });
    } else {
      this.setState({
        validBaseValue: true
      });
      
      this.updateRangeSliders(_.toInteger(newValue));      
    }
    
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
    // return null if base value is not valid
    if (!this.state.validBaseValue) {
      return null;
    }
    
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
      <div className={styles.dimensionRangeInput}>
        <div className={styles.firstRow}>
          <div className={styles.baseInput}>
            <BaseInput
              type="text"
              label={this.props.label}
              ref="baseValue"
              validationState={validateBaseValue(this.state.baseValue)}
              value={this.state.baseValue}
              handleChange={this.handleBaseValueChange}
            />
          </div>
          <div className={styles.checkbox}>
            <BaseCheckbox 
              disabled={!this.state.validBaseValue} 
              ref="checkbox" 
              label="customizable"
              handleChange={this.handleCustomizableChange} 
            />
          </div>
        </div>
        
        <FormGroup className={styles.sliderGroup} hidden={!(this.state.valueCustomizable && this.state.validBaseValue)}>
          <Row>
            <Col md={6} xs={6}>
              <SingleRangeSlider label="Min value" connect="upper" ref="lowerSlider" />
            </Col>
            <Col md={6} xs={6}>
              <SingleRangeSlider label="Max value" connect="lower" ref="upperSlider" />
            </Col>
          </Row>
        </FormGroup>
      </div>
    );
    
  }
}

DimensionRangeInput.propTypes = {
  label: React.PropTypes.string,
  ref: React.PropTypes.string
};

DimensionRangeInput.defaultProps = {
  label: "Dimension",
  ref: "dimension"
};
