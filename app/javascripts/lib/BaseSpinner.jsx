"use strict"

import React from "react"

import styles from "lib/BaseSpinner.scss"

export default class BaseSpinner extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    
    return (
      <div className={styles.baseSpinner} {...this.props}>
        <div className={styles.spinner}></div>
      </div>
      
    );
  }
}
