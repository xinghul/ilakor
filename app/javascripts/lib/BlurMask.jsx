"use strict"

import React from "react"

import styles from "lib/BlurMask.scss"

export default class BlurMask extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    
    return (
      <div {...this.props} className={styles.blurMask} />
    );
  }
}
