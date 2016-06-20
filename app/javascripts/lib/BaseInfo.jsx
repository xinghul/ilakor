"use strict"

import React from "react"
import _ from "lodash"
import { FormGroup, InputGroup, FormControl } from "react-bootstrap"
import FontAwesome from "react-fontawesome"

import styles from "lib/BaseInfo.scss"

export default class BaseInfo extends React.Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    
    return (
      <FormGroup className={styles.baseInfo}>
        <div className={styles.addonContent}>
          <FontAwesome
            name={this.props.icon}
            fixedWidth={true}
          />
          <label>{this.props.label}</label>
        </div>
        <FormControl.Static>
          {this.props.text}
        </FormControl.Static>
      </FormGroup>
    );
    
  }
}

BaseInfo.propTypes = { 
  label: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired,
  icon: React.PropTypes.string
};

BaseInfo.defaultProps = {
  icon: "circle"
};