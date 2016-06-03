"use strict"

import React from "react"
import Slider from "nouislider"
import _ from "lodash"
import invariant from "invariant"

import sliderStyles from "nouislider/distribute/nouislider.min.css"

import styles from "lib/SingleRangeSlider.scss"

let _sliderWrapper;

export default class SingleRangeSlider extends React.Component {
  
  constructor(props) {
    super(props);
    
    invariant(props.range.min < props.range.max, `min value ${props.range.min} should be less than max value ${props.range.max}.`);
    invariant(_.inRange(props.start, props.range.min, props.range.max), `start value ${props.start} should be in range of min value ${props.range.min} and max value ${props.range.max}`);
  }
  
  componentDidMount() {
    _sliderWrapper = document.getElementById("sliderWrapper");

    Slider.create(sliderWrapper, {
      ...this.props
    });
  }
  
  getValue() {
    return _sliderWrapper.noUiSlider.get();
  }
  
  render() {
    
    return (
      <div id="sliderWrapper">
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
  start: React.PropTypes.number
};

SingleRangeSlider.defaultProps = {
  step: 1,
  tooltips: true,
  range: {
    min: 0,
    max: 100
  },
  start: 40
};

