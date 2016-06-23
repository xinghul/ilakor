"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import MaskedInput from "lib/MaskedInput"

import styles from "components/CheckoutApp/PhoneNumberInput.scss"

export default class PhoneNumberInput extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      value: ""
    };
  }
  
  handleChange = (newValue) => {    
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
    
    this.refs["maskedInput"].clear();
  }
  
  render() {
    
    return (
      <div className={styles.phoneNumberInput}>
        <MaskedInput
          ref="maskedInput"
          autoComplete="tel"
          mask="(999) 999-9999"
          label="Phone"
          icon="mobile"
          value={this.state.value}
          handleChange={this.handleChange}
        />
      </div>
      
    );
  }
}

PhoneNumberInput.propTypes = {
  handleChange: React.PropTypes.func
};

PhoneNumberInput.defaultProps = {
  handleChange: function() {}
};
