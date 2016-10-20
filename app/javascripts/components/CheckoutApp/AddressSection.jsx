import React from "react";
import _ from "lodash";
import invariant from "invariant";

import Input from "lib/Input";
import GridSection from "lib/GridSection";
import SubmitButton from "lib/SubmitButton";
import AlertMessage from "lib/AlertMessage";

import styles from "components/CheckoutApp/AddressSection.scss";

/**
 * @class
 * @extends {React.Component}
 */
export default class AddressSection extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
  }
  
  /**
   * @private
   * Handler for receiving the stripe payment info.
   * 
   * @param  {Object} paymentInfo the payment info.
   * @param  {Object} addressInfo the address info.
   */
  _onSubmitAddress = () => {
    this.props.handlePayment(paymentInfo, addressInfo);
  };
  
  /**
   * @inheritdoc
   */
  render() {
    return (
      <GridSection>
        <SubmitButton />
      </GridSection>
    );
  }
}

AddressSection.propTypes = {
};

AddressSection.defaultProps = {
};
