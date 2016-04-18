"use strict"

import React from "react"
import _ from "underscore"
import CSSModules from "react-css-modules"

import { Button } from "react-bootstrap"
import styles from "./FacebookButton.css"

class FacebookButton extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    let newProps = _.clone(this.props);
    
    return (
      <Button {...newProps} styleName="facebookButton" />
    );
  }
}

export default CSSModules(FacebookButton, styles)