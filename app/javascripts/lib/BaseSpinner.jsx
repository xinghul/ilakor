"use strict"

import React from "react"
import _ from "lodash"

import styles from "lib/BaseSpinner.scss"

export default class BaseSpinner extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    
    let style = {
      display: _.isEmpty(this.props.text) ? "none" : "inline-block"
    };
    
    return (
      <div className={styles.baseSpinner} {...this.props}>
        <div style={style} className={styles.spinnerText}>{this.props.text}</div>
        <div className={styles.spinner}></div>
      </div>
      
    );
  }
}

BaseSpinner.propTypes = {
  text: React.PropTypes.string
};

BaseSpinner.defaultProps = {
  text: ""
};

