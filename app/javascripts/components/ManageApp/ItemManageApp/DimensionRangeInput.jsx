import React from "react";
import _ from "lodash";
import invariant from "invariant";

import { Form, FormGroup, InputGroup, ControlLabel, Row, Col } from "react-bootstrap";

import Input from "lib/Input";
import Checkbox from "lib/Checkbox";
import SingleRangeSlider from "lib/SingleRangeSlider";

import styles from "components/ManageApp/ItemManageApp/DimensionRangeInput.scss";

const positiveNumberReg = /^\d*[1-9]\d*$/;

/**
 * Validates if given input value is valid.
 * 
 * @param  {String} value given input value.
 * 
 * @return {String} 
 */
function validateInputValue(value) {

  if (_.isEmpty(value)) {
    return;
  }

  if (positiveNumberReg.test(value)) {
    return "success";
  }
  
  return "error";
}

export default class DimensionRangeInput extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      baseValue: "",
      validBaseValue: false,
      valueCustomizable: false,
      pricePerUnit: "10",
      validPricePerUnit: true
    };
  }
  
  /**
   * @private
   * Handler for when customizable checkbox's value changes.
   * 
   * @param  {Boolean} newValue the new checked value.
   */
  _onCustomizableChange = (newValue) => {
    
    invariant(_.isBoolean(newValue), `_onCustomizableChange() expects a 'boolean' value as input, but gets '${typeof newValue}'.`);
    
    this.setState({
      valueCustomizable: newValue
    });
  };
  
  /**
   * @private
   * Handler for when price per unit input's value changes.
   * 
   * @param  {String} newValue the new input value.
   */
  _onPricePerUnitChange = (newValue) => {
    
    invariant(_.isString(newValue), `_onPricePerUnitChange() expects a 'string' value as input, but gets '${typeof newValue}'.`);

    this.setState({
      pricePerUnit: newValue,
      validPricePerUnit: !!positiveNumberReg.test(newValue)
    });
  };
  
  /**
   * @private
   * Handler for when base value input's value changes.
   * 
   * @param  {String} newValue the new input value.
   */
  _onBaseValueChange = (newValue) => {
    
    invariant(_.isString(newValue), `_onBaseValueChange() expects a 'string' value as input, but gets '${typeof newValue}'.`);
    
    let input = this.refs["baseValue"];
    
    this.setState({
      baseValue: newValue
    });
    
    // check if the new base value is a positive number
    if (!!positiveNumberReg.test(newValue)) {
      this.setState({
        validBaseValue: true
      });
      
      this._updateRangeSliders(_.toInteger(newValue));      
    } else {
      this.setState({
        validBaseValue: false
      });
    }
    
  };
  
  /**
   * @private
   * Updates the ranges for max and min range sliders, based on new base value.
   * 
   * @param  {Number} baseValue the new base value.
   */
  _updateRangeSliders(baseValue) {
    
    invariant(_.isInteger(baseValue), `_updateRangeSliders() expects a 'integer' value as input, but gets '${typeof baseValue}'.`);
    
    let lowerRange = {
      min: Math.max(0, baseValue - 200),
      max: baseValue
    };
    let lowerStart = Math.max(0, baseValue - 20);
    
    let upperRange = {
      min: baseValue,
      max: baseValue + 200,
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
  
  /**
   * Returns the value of the dimension range input.
   * 
   * @return {Object} the value of the dimension range input.
   */
  getValue() {

    // return null if base value or price per unit is not valid
    if (!(this.state.validBaseValue && this.state.validPricePerUnit)) {
      return null;
    }
    
    let value = {
      base: this.state.baseValue,
      customizable: this.state.valueCustomizable
    };
    
    if (this.state.valueCustomizable) {
      value["min"] = this.refs["lowerSlider"].getValue();
      value["max"] = this.refs["upperSlider"].getValue();
      value["pricePerUnit"] = this.refs["pricePerUnit"].getValue();
    }
    
    return value;
  }
  
  /**
   * Reset the dimension range input state.
   */
  clear() {
    this.refs["baseValue"].clear();
    this.refs["checkbox"].clear();
    
    this.setState({
      baseValue: "",
      validBaseValue: false,
      valueCustomizable: false
    });
  }
  
  /**
   * @inheritdoc
   */
  render() {
    
    let sliderGroupStyle = {
      maxHeight: this.state.valueCustomizable && this.state.validBaseValue ? "138px" : ""
    };
    
    return (
      <div className={styles.dimensionRangeInput}>
        <div className={styles.firstRow}>
          <div className={styles.baseInput}>
            <Input
              label={this.props.label}
              ref="baseValue"
              validationState={validateInputValue(this.state.baseValue)}
              value={this.state.baseValue}
              onChange={this._onBaseValueChange}
            />
          </div>
          <div className={styles.checkbox}>
            <Checkbox 
              disabled={!this.state.validBaseValue} 
              ref="checkbox" 
              label="customizable"
              onChange={this._onCustomizableChange} 
            />
          </div>
        </div>
        
        <FormGroup 
          style={sliderGroupStyle} 
          className={styles.customizableContent} 
        >
          <Row className={styles.sliderGroupContent}>
            <Col md={6} xs={6}>
              <SingleRangeSlider label="Min" connect="upper" ref="lowerSlider" />
            </Col>
            <Col md={6} xs={6}>
              <SingleRangeSlider label="Max" connect="lower" ref="upperSlider" />
            </Col>
          </Row>
          <Input
            className={styles.pricePerUnitInput}
            type="text"
            label="Price per unit"
            ref="pricePerUnit"
            validationState={validateInputValue(this.state.pricePerUnit)}
            value={this.state.pricePerUnit}
            onChange={this._onPricePerUnitChange}
          />
        </FormGroup>
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
