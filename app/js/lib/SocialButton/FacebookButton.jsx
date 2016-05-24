"use strict"

import React from "react"
import _ from "underscore"

import { Button } from "react-bootstrap"
import styles from "lib/SocialButton/FacebookButton.scss"

export default class FacebookButton extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    let newProps = _.clone(this.props);
    
    return (
      <Button {...newProps} className={styles.facebookButton} />
    );
  }
}
