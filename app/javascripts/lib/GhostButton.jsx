"use strict"

import React from "react"
import _ from "lodash"
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
    
    let classNames = [ styles.ghostButton ]
    ,   buttonProps = _.clone(this.props);
    
    // push in additional className 
    classNames.push(this.props.className);
    
    classNames.push(styles[this.props.theme]);
    
    delete buttonProps.theme;
    
    return (
      <Button 
        {...buttonProps}
        className={classNames.join(' ')}
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
