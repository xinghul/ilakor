"use strict";

import React from "react"

import styles from "lib/LoadSpinner.scss"

export default class Loader extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    
    return (
      <div {...this.props}>
        <div className={styles.loader}>
          <div className={styles.inner + ' ' + styles.one}></div>
          <div className={styles.inner + ' ' + styles.two}></div>
          <div className={styles.inner + ' ' + styles.three}></div>
        </div>
        <div className={styles.loaderText}>LOADING</div>
      </div>
      
    );
  }
}
