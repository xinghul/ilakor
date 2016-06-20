"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import GridSection from "lib/GridSection"
import BaseInfo from "lib/BaseInfo"

import styles from "components/OrderManageApp/CustomerDetailSection.scss"

export default class CustomerDetailSection extends React.Component {
  
  constructor(props) {
    super(props);    
  }
  
  render() {
    
    let user = this.props.user;
    
    if (_.isEmpty(user)) {
      return null;
    }
    
    return (
      <GridSection title="Customer information" className={styles.customerDetailSection}>
        <BaseInfo label="User" icon="user" text={user.username} />
        <BaseInfo label="Email" icon="envelope" text={user.email} />
        <BaseInfo label="Id" text={user._id} />
      </GridSection>
    );
  }
}

CustomerDetailSection.propTypes = {
  user: React.PropTypes.object
};

CustomerDetailSection.defaultProps = {
  user: {}
};
