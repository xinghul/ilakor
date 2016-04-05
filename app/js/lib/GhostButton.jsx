"use strict"

import React from "react"
import _ from "underscore"
import { Button } from "react-bootstrap"
import CSSModules from "react-css-modules"

import styles from "./GhostButton.css"

class GhostButton extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    let color = this.props.color;
    
    let newProps = _.clone(this.props);
    
    newProps["style"] = {
      color: color,
      
      borderColor: color
    };
    
    return (
      <Button {...newProps} styleName="ghostButton" />
    );
  }
}

GhostButton.propTypes = {
  color: React.PropTypes.string
};

GhostButton.defaultProps = {
  color: "white"
};

export default CSSModules(GhostButton, styles)