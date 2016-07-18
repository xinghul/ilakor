"use strict"

import React from "react"
import _ from "lodash"

import styles from "lib/LoadSpinner.scss"

export default class LoadSpinner extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
  }
  
  /**
   * @inheritdoc
   */
  render() {
    
    let classNames = [ styles.loadSpinner ];
    
    // push in additional className 
    classNames.push(this.props.className);
    
    let style = {
      display: _.isEmpty(this.props.text) ? "none" : "inline-block"
    };
    
    return (
      <div className={classNames.join(' ')}>
        <div style={style} className={styles.spinnerText}>{this.props.text}</div>
        <div className={styles.spinner}></div>
      </div>
      
    );
  }
}

LoadSpinner.propTypes = {
  text: React.PropTypes.string
};

LoadSpinner.defaultProps = {
  text: ""
};

