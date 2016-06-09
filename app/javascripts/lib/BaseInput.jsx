"use strict"

import React from "react"
import _ from "lodash"
import { FormGroup, InputGroup, FormControl } from "react-bootstrap"
import FontAwesome from "react-fontawesome"

import styles from "lib/BaseInput.scss"

export default class BaseInput extends React.Component {
  
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
      value: ""
    });
  }

  render() {
    
    let selectOptions = null
    ,   validationState = null
    ,   addonContent = null;
    
    let newProps = _.clone(this.props);
    
    if (!_.isEmpty(newProps.validationState)) {
      validationState = newProps.validationState;
      
      delete newProps.validationState;
    }
    
    if (newProps.type === "select") {
      selectOptions = [];
      
      for (let optionValue of newProps.options)
      {
        selectOptions.push(
          <option key={optionValue} value={optionValue}>{optionValue}</option>
        );
      }
      
      delete newProps.options;
    }
    
    // special case for 'select' and 'textarea'
    if (newProps.type === "select" || newProps.type === "textarea") {
      newProps.componentClass = newProps.type;
      
      delete newProps.type;
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
        className={styles.baseInput} 
        controlId={newProps.key} 
        validationState={validationState}
      >
        <InputGroup>
          {addonContent}
          <FormControl 
            {...newProps}
            value={this.props.value ? this.props.value : this.state.value}
            onChange={this.handleChange}
            onFocus={this.handleOnFocus}
            onBlur={this.handleOnBlur}
          >{selectOptions}</FormControl>
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

BaseInput.propTypes = { 
  // required props
  type: React.PropTypes.string.isRequired,
  
  // most used props
  handleChange: React.PropTypes.func,
  label: React.PropTypes.string
};

BaseInput.defaultProps = {
  handleChange: function() {},
  label: ""
};