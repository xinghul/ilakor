"use strict";

import React from "react"

import styles from "components/ItemDisplayApp/LoadItemSpinner.scss"

export default class LoadItemSpinner extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    
    return (
      <div {...this.props} className={styles.loadItemSpinner}>
        <div className={styles.spinner}>
          <div className={styles.inner + ' ' + styles.one}></div>
          <div className={styles.inner + ' ' + styles.two}></div>
          <div className={styles.inner + ' ' + styles.three}></div>
        </div>
        <div className={styles.loaderText}>LOADING</div>
      </div>
    );
  }
}
