"use strict"

import React from "react"
import _ from "lodash"

import { Button } from "react-bootstrap"
import styles from "lib/SocialButton/FacebookButton.scss"

export default class FacebookButton extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {

    return (
      <Button {...this.props} className={styles.loginBtn + ' ' + styles.loginBtnFacebook}>
        <a href="/auth/facebook">Continue with Facebook</a>
      </Button>
    );
  }
}
