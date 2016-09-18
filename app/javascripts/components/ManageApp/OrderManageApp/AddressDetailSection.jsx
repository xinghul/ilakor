"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import GridSection from "lib/GridSection"
import BaseInfo from "lib/BaseInfo"

import styles from "components/ManageApp/OrderManageApp/AddressDetailSection.scss"

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
        <BaseInfo label="Name" icon="user" text={address.shipping_name} />
        <BaseInfo label="Street" icon="home" text={address.shipping_address_line1} />
        <BaseInfo label="City" icon="map-marker" text={`${address.shipping_address_city}, ${address.shipping_address_state} ${address.shipping_address_zip}`} />
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
