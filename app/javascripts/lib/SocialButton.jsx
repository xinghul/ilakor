"use strict"

import React from "react"
import _ from "lodash"

import GhostButton from "lib/GhostButton"

import styles from "lib/SocialButton.scss"

export default class SocialButton extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
  }
  
  /**
   * Handler for the button click.
   */
  _onClick = () => {
    window.location.href = `/auth/${this.props.type}`;
  };
  
  /**
   * @inheritdoc
   */
  render() {
    
    let type = this.props.type;
    
    return (
      <div className={styles.socialButton}>
        <div className={styles[type]}>
          <GhostButton 
            className={styles.buttonInner}
            theme="grey"
            disabled={this.props.disabled}
            onClick={this._onClick}
          >
            <span className={styles.icon + ` zocial-${type}`}></span>
            <span className={styles.label}>{this.props.leadingText + ' ' + _.capitalize(type)}</span>
          </GhostButton>
          <div className={styles.cover}>
            <div className={styles.innie + ` zocial-${type}`}></div>
            <div className={styles.spine}></div>
            <div className={styles.outie + ` zocial-${type}`}></div>
          </div>
          <div className={styles.shadow}></div>
        </div>
      </div>
    );
  }
}

SocialButton.propTypes = {
  type: React.PropTypes.oneOf(["facebook", "twitter", "googleplus", "linkedin"]),
  disabled: React.PropTypes.bool,
  leadingText: React.PropTypes.string
};

SocialButton.defaultProps = {
  type: "facebook",
  disabled: false,
  leadingText: "Continue with"
};
