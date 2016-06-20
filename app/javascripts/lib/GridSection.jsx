"use strict"

import React from "react"
import _ from "lodash"

import styles from "lib/GridSection.scss"

export default class GridSection extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    
    return (
      <div {...this.props}>
        <div className={styles.gridSection}>
          <div hidden={_.isEmpty(this.props.title)} className={styles.gridTitle}>{this.props.title}</div>
          {this.props.children}
        </div>
      </div>
    );
  }
}
