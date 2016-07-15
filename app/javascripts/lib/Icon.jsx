"use strict"

import React from "react"
import FontAwesome from "react-fontawesome"

import styles from "lib/Icon.scss"

export default class Icon extends React.Component {
  
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
    
    let style = {
      opacity: this.props.hoverable ? "0.6" : "",
      cursor: this.props.hoverable ? "pointer" : "",
      height: this.props.cover ? "100%" : "",
      width: this.props.cover ? "100%" : ""
    };
    
    return (
      <FontAwesome
        className={styles.icon}
        style={style}
        name={this.props.name}
      />
    );
  }
}

Icon.propTypes = {
  name: React.PropTypes.string.isRequired,
  hoverable: React.PropTypes.bool,
  cover: React.PropTypes.bool
}

Icon.defaultProps = {
  hoverable: false,
  cover: false
}
