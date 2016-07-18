"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import GridSection from "lib/GridSection"
import BaseInfo from "lib/BaseInfo"

import styles from "components/AccountApp/AccountDetailSection.scss"

export default class AccountDetailSection extends React.Component {
  
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
    
    let user = this.props.user;
    
    return (
      <GridSection title="Account detail" className={styles.accountDetailSection}>
        <BaseInfo label="User" icon="user" text={user.username} />
        <BaseInfo label="Email" icon="envelope" text={user.email} />
      </GridSection>
    );
  }
}

AccountDetailSection.propTypes = {
  user: React.PropTypes.object.isRequired
};
