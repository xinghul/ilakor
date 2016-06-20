"use strict"

import React from "react"
import _ from "lodash"

import { FormGroup, InputGroup } from "react-bootstrap"
import FontAwesome from "react-fontawesome"

import InputMask from "react-input-mask"

import styles from "lib/MaskedInput.scss"

export default class MaskedInput extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      value: this.props.initialValue || "",
      focused: false
    };
  }
  
  handleChange = (evt) => {
    let newValue = evt.target.value;

    this.setState({
      value: newValue
    });

    this.props.handleChange(newValue);
  };
  
  handleOnFocus = () => {
    this.setState({
      focused: true
    });
  };
  
  handleOnBlur = () => {
    this.setState({
      focused: false
    });
  };
  
  getValue() {
    return this.state.value;
  }
  
  clear() {
    this.setState({
      value: this.props.initialValue || "",
      focused: false
    });
  }

  render() {
    
    let validationState = null
    ,   addonContent = null;
    
    let newProps = _.clone(this.props);
    
    if (!_.isEmpty(newProps.validationState)) {
      validationState = newProps.validationState;
      
      delete newProps.validationState;
    }
    
    addonContent = do {
      if (!_.isEmpty(newProps.icon)) {
        <InputGroup.Addon className={styles.addonContent}>
          <FontAwesome
            name={newProps.icon}
            fixedWidth={true}
          />
          &nbsp; 
          <label>{newProps.label}</label>
        </InputGroup.Addon>
      } else {
        <InputGroup.Addon className={styles.addonContent}>
          <label>{newProps.label}</label>
        </InputGroup.Addon>
      }
    }
    
    let style = {
      maxHeight: this.state.focused ? "60px" : ""
    };

    return (
      <FormGroup 
        className={styles.maskedInput} 
        controlId={newProps.key} 
        validationState={validationState}
      >
        <InputGroup>
          {addonContent}
          <InputMask 
            {...newProps}
            maskChar={this.props.maskChar}
            className="form-control"
            value={this.props.value ? this.props.value : this.state.value}
            onChange={this.handleChange}
            onFocus={this.handleOnFocus}
            onBlur={this.handleOnBlur}
          />
        </InputGroup>
        <div 
          hidden={_.isEmpty(newProps.focusText)} 
          className={styles.focusContentContainer} 
          style={style}
        >
          <div className={styles.focusContent}>
            {newProps.focusText}
          </div>
        </div>
      </FormGroup>
      
    );
    
  }
}

MaskedInput.propTypes = { 
  // required props
  mask: React.PropTypes.string.isRequired,
  
  maskChar: React.PropTypes.string,
  type: React.PropTypes.string,
  handleChange: React.PropTypes.func,
  label: React.PropTypes.string
};

MaskedInput.defaultProps = {
  maskChar: " ",
  type: "text",
  handleChange: function() {},
  label: ""
};
