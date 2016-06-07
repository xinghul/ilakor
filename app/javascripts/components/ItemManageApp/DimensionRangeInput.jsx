"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import { Form, FormGroup, ControlLabel, Col } from "react-bootstrap"

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
      <Form horizontal>
        <FormGroup controlId="baseValue">
          <Col componentClass={ControlLabel} md={2} xs={2}>
            {this.props.label}
          </Col>
          <Col md={3} xs={3}>
            <BaseInput
              type="text"
              handleChange={this.handleBaseValueChange}
            />
          </Col>
          <Col md={3} xs={3} className={styles.customizableCheckbox}>
            <BaseCheckbox label="customizable" handleChange={this.handleCustomizableChange} />
          </Col>
        </FormGroup>
        <FormGroup hidden={!this.state.valueCustomizable}>
          <Col componentClass={ControlLabel} md={2} xs={2}>
            Min value
          </Col>
          <Col md={4} xs={4} className={styles.rangeSlider}>
            <SingleRangeSlider connect="upper" ref="lowerSlider" />
          </Col>
          <Col componentClass={ControlLabel} md={2} xs={2}>
            Max value
          </Col>
          <Col md={4} xs={4} className={styles.rangeSlider}>
            <SingleRangeSlider connect="lower" ref="upperSlider" />
          </Col>
        </FormGroup>
      </Form>
    );
    
  }
}

DimensionRangeInput.propTypes = {
  label: React.PropTypes.string
};

DimensionRangeInput.defaultProps = {
  label: "Dimension"
};
