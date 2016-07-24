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
   * @private
   * Renders the account detail section.
   * 
   * @return {JSX}
   */
  _renderAccountDetailSection() {
    let user = this.props.user;
    
    return (
      <GridSection title="Account detail">
        <BaseInfo label="User" icon="user" text={user.username} />
        <BaseInfo label="Email" icon="envelope" text={user.email} />
      </GridSection>
    );
  }
  
  /**
   * @private
   * Renders the account detail section.
   * 
   * @return {JSX}
   */
  _renderSocialAccountsSection() {
    let user = this.props.user;
    
    return (
      <GridSection title="Social accounts">
      </GridSection>
    );
  }
  
  /**
   * @inheritdoc
   */
  render() {
    
    return (
      <div className={styles.accountDetailSection}>
        {this._renderAccountDetailSection()}
        {this._renderSocialAccountsSection()}
      </div>
    );
  }
}

AccountDetailSection.propTypes = {
  user: React.PropTypes.object.isRequired
};
