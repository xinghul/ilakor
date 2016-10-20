import React from "react";
import _ from "lodash";
import invariant from "invariant";

import GridSection from "lib/GridSection";

import styles from "components/CheckoutApp/PaymentSection.scss";

/**
 * @class
 * @extends {React.Component}
 */
export default class PaymentSection extends React.Component {

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
    
    return (
      <GridSection>
        {this._createPaymentJsx()}
      </GridSection>
    );
    
  }

  /**
   * @private
   * Creates the JSX for the payment section.
   *
   * @return {JSX}
   */
  _createPaymentJsx() {

    return (
      <div>
        Thank you for shopping with us. We’ll send a confirmation when your order ships.
      </div>
    );
  }
}
