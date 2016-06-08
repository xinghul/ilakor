"use strict"

import React from "react"
import _ from "lodash"
import { FormGroup, InputGroup, FormControl, ControlLabel, Glyphicon } from "react-bootstrap"

import styles from "lib/BaseInput.scss"

export default class BaseInput extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      value: this.props.initialValue || ""
    };
  }
  
  handleChange = (evt) => {
    let newValue = evt.target.value;

    this.setState({
      value: newValue
    });

    this.props.handleChange(newValue);
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
    ,   validationState = null;
    
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
    
    return (
      <FormGroup className={styles.baseInput} controlId={newProps.key} validationState={validationState}>
        <InputGroup>
          <InputGroup.Addon>{newProps.label}</InputGroup.Addon>
          <FormControl 
            {...newProps}
            value={this.state.value}
            onChange={this.handleChange}
          >{selectOptions}</FormControl>
        </InputGroup>
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