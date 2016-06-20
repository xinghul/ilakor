"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import GridSection from "lib/GridSection"
import BaseInfo from "lib/BaseInfo"

import styles from "components/OrderManageApp/AddressDetailSection.scss"

export default class AddressDetailSection extends React.Component {
  
  constructor(props) {
    super(props);    
  }
  
  render() {
    
    let address = this.props.address;
    
    if (_.isEmpty(address)) {
      return null;
    }
    
    return (
      <GridSection title="Shipping information" className={styles.addressDetailSection}>
        <BaseInfo label="Name" icon="user" text={address.name} />
        <BaseInfo label="Phone" icon="mobile" text={address.phone} />
        <BaseInfo label="Street" icon="home" text={address.street} />
        <BaseInfo label="City" icon="map-marker" text={`${address.city}, ${address.state} ${address.zip}`} />
      </GridSection>
    );
  }
}

AddressDetailSection.propTypes = {
  address: React.PropTypes.object
};

AddressDetailSection.defaultProps = {
  address: {}
};
