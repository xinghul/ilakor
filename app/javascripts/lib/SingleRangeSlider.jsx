"use strict"

import React from "react"
import Slider from "nouislider"
import Mock from "mock-data"
import _ from "lodash"
import invariant from "invariant"

import { InputGroup } from "react-bootstrap"

import sliderStyles from "nouislider/distribute/nouislider.min.css"

import styles from "lib/SingleRangeSlider.scss"

export default class SingleRangeSlider extends React.Component {
  
  constructor(props) {
    super(props);
    
    this._sliderId = _.uniqueId("slider");
    this._sliderWrapper = null;
    
    invariant(props.range.min < props.range.max, `min value ${props.range.min} should be less than max value ${props.range.max}.`);
    invariant(_.inRange(props.start, props.range.min, props.range.max), `start value ${props.start} should be in range of min value ${props.range.min} and max value ${props.range.max}`);
  }
  
  componentDidMount() {
    this._sliderWrapper = document.getElementById(this._sliderId);
    
    Slider.create(this._sliderWrapper, {
      ...this.props
    });
  }
  
  update(config) {
    this._sliderWrapper.noUiSlider.updateOptions(config);
  }
  
  getValue() {
    return _.toInteger(this._sliderWrapper.noUiSlider.get());
  }
  
  render() {
    
    return (
      <div className={styles.singleRangeSlider}>
        <InputGroup>
          <InputGroup.Addon>{this.props.label}</InputGroup.Addon>
          <div id={this._sliderId} />
        </InputGroup>
      </div>
    );
  }
}


SingleRangeSlider.propTypes = {
  step: React.PropTypes.number,
  tooltips: React.PropTypes.bool,
  range: React.PropTypes.shape({
    min: React.PropTypes.number,
    max: React.PropTypes.number
  }),
  start: React.PropTypes.number,
  label: React.PropTypes.string
};

SingleRangeSlider.defaultProps = {
  step: 1,
  tooltips: true,
  range: {
    min: 0,
    max: 100
  },
  start: 40,
  label: ""
};

