import React from "react";
import _ from "lodash";
import invariant from "invariant";
import StripeCheckout from "react-stripe-checkout";

import styles from "components/CheckoutApp/PaymentApp.scss";

/**
 * @class
 * @extends {React.Component}
 */
export default class PaymentApp extends React.Component {
  
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
  _onPaymentInfoReceived = (paymentInfo, addressInfo) => {
    this.props.handlePayment(paymentInfo, addressInfo);
  };
  
  /**
   * @inheritdoc
   */
  render() {
    return (
      <div className={styles["payment-app"]}>
        <StripeCheckout 
          token={this._onPaymentInfoReceived}
          stripeKey="pk_test_8mZpKZytd30HOivscwbQk51Z"
          image="/images/logo.png"
          amount={this.props.amount * 100}
          shippingAddress={true}
          alipay={true}
          allowRememberMe={false}
          panelLabel="Pay"
        >
          {this.props.children}
        </StripeCheckout>
      </div>
    );
  }
}

PaymentApp.propTypes = {
  amount: React.PropTypes.number.isRequired,
  handlePayment: React.PropTypes.func
};

PaymentApp.defaultProps = {
  handlePayment: function() {}
};
