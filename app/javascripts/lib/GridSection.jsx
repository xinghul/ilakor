"use strict"

import React from "react"

import styles from "lib/GridSection.scss"

export default class GridSection extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    
    return (
      <div {...this.props} className={styles.gridSection}>
        {this.props.children}
      </div>
    );
  }
}
