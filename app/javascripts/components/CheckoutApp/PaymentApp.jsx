"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"
import StripeCheckout from "react-stripe-checkout"

import styles from "components/CheckoutApp/PaymentApp.scss"

export default class PaymentApp extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  handleTokenChange = (paymentInfo, addressInfo) => {
    this.props.handlePayment(paymentInfo, addressInfo);
  };
  
  render() {
    return (
      <div className={styles["payment-app"]}>
        <StripeCheckout 
          token={this.handleTokenChange}
          stripeKey="pk_test_8mZpKZytd30HOivscwbQk51Z"
          image="/images/logo.png"
          amount={this.props.amount}
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
