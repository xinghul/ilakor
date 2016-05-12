"use strict"

import React from "react"
import CSSModules from "react-css-modules"

import styles from "./BaseSpinner.css"

class BaseSpinner extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    
    return (
      <div styleName="spinnerWrapper" {...this.props}>
        <div styleName="spinner"></div>
      </div>
      
    );
  }
}

export default CSSModules(BaseSpinner, styles, { allowMultiple: true })