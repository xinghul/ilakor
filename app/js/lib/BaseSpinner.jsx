"use strict"

import React from "react"

import styles from "./BaseSpinner.css"

export default class BaseSpinner extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    
    return (
      <div className="spinnerWrapper" {...this.props}>
        <div className="spinner"></div>
      </div>
      
    );
  }
}
