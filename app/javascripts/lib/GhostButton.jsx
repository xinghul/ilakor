"use strict"

import React from "react"
import _ from "lodash"
import { Button } from "react-bootstrap"

import styles from "lib/GhostButton.scss"

export default class GhostButton extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    
    let style = {
      color: this.props.color
    };
    
    return (
      <Button 
        {...this.props}
        style={style}
        className={styles.ghostButton}
      >
        {this.props.children}
      </Button>
    );
  }
}

GhostButton.propTypes = {
  color: React.PropTypes.string
};

GhostButton.defaultProps = {
  color: "white"
};
