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
    
    if (this.props.inverse) {
      className.push(styles.inverse);
    } else {
      className.push(styles.normal);
    }
    
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
  inverse: React.PropTypes.bool
};

GhostButton.defaultProps = {
  inverse: false
};
