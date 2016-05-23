"use strict"

import React from "react"
import _ from "underscore"
import { Button } from "react-bootstrap"

import styles from "./GhostButton.css"

export default class GhostButton extends React.Component {
  
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
      <Button {...newProps} className="ghostButton" />
    );
  }
}

GhostButton.propTypes = {
  color: React.PropTypes.string
};

GhostButton.defaultProps = {
  color: "white"
};
