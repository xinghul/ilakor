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
    let newValue = evt.target.value
    ,   name = evt.target.name;

    this.setState({
      value: newValue
    });

    this.props.handleChange(newValue, name);
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
    
    let selectOptions = null
    ,   validationState = null
    ,   addonClassname
    ,   addonContent;
    
    let newProps = _.clone(this.props);
    
    if (!_.isEmpty(newProps.validationState)) {
      validationState = newProps.validationState;
      
      delete newProps.validationState;
    }
    
    if (newProps.type === "select") {
      selectOptions = newProps.options;
      
      delete newProps.options;
    }
    
    // special case for 'select' and 'textarea'
    if (newProps.type === "select" || newProps.type === "textarea") {
      newProps.componentClass = newProps.type;
      
      delete newProps.type;
    }
    
    addonClassname = do {
      if (this.props.shrink) {
        styles.addonContentShrink
      } else {
        styles.addonContent
      }
    }

    addonContent = do {
      if (!_.isEmpty(newProps.icon)) {
        <InputGroup.Addon className={addonClassname}>
          <FontAwesome
            name={newProps.icon}
            fixedWidth={true}
          />
          &nbsp; 
          <label>{newProps.label}</label>
        </InputGroup.Addon>
      } else {
        <InputGroup.Addon className={addonClassname}>
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
  type: React.PropTypes.string,
  handleChange: React.PropTypes.func,
  label: React.PropTypes.string
};

BaseInput.defaultProps = {
  type: "text",
  handleChange: function() {},
  label: ""
};