"use strict"

import React from "react"
import { Button } from "react-bootstrap"

import styles from "lib/GhostButton.scss"

export default class GhostButton extends React.Component {
  
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
    
    let className = [ styles.ghostButton ];
    
    // push in additional className 
    className.push(this.props.className);
    
    className.push(styles[this.props.theme]);
    
    return (
      <Button 
        {...this.props}
        className={className.join(' ')}
      >
        {this.props.children}
      </Button>
    );
  }
}

GhostButton.propTypes = {
  theme: React.PropTypes.oneOf(["white", "grey", "black", "gold", "success", "warning", "danger"])
};

GhostButton.defaultProps = {
  theme: "white"
};
