import React from "react";
import _ from "lodash";
import Numeral from "numeral";
import invariant from "invariant";
import { hashHistory } from "react-router";

import { Glyphicon } from "react-bootstrap";

import styles from "components/CheckoutApp.scss";

import PaymentApp from "./CheckoutApp/PaymentApp";
import SubmitButton from "lib/SubmitButton";
import AlertMessage from "lib/AlertMessage";

import ShoppingCartStore from "stores/ShoppingCartStore";
import OrderAction from "actions/OrderAction";
import AuthStore from "stores/AuthStore";

/**
 * Gets the new state from subscribed stores.
 * 
 * @return {Object}
 */
function getStateFromStores() {
  return {
    items: ShoppingCartStore.getItems(),
    totalPrice: ShoppingCartStore.getTotalPrice()
  };
}

/**
 * @class
 * @extends {React.Component}
 */
export default class CheckoutApp extends React.Component {
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      items: ShoppingCartStore.getItems(),
      totalPrice: ShoppingCartStore.getTotalPrice(),

      errorMessage: "",
      isSubmitting: false,
      checkoutFinish: false
    };
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    ShoppingCartStore.subscribe(this._onChange);
  }

  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    ShoppingCartStore.unsubscribe(this._onChange);
  }
  
  /**
   * @private
   * Handler for when subscribed stores emit 'change' event.
   */
  _onChange = () => {
    this.setState(getStateFromStores());
  };
  
  /**
   * @private
   * Handler for when the payment information is received.
   */
  _onReceivedPayment = (paymentInfo, addressInfo) => {

    this.setState({
      isSubmitting: true
    });

    let orderInfo = {
      totalPrice: this.state.totalPrice,
      items: this.state.items,
      user: AuthStore.getUser()
    };
    
    OrderAction.addOrder(paymentInfo, addressInfo, orderInfo)
    .then((res) => {
      this.setState({
        checkoutFinish: true
      });
      
      setTimeout(() => {
        hashHistory.push("/");
      }, 3000);
    })
    .catch((message) => {      
      this.setState({
        errorMessage: message
      });
      
      this.refs["alert"].show();
    })
    .finally(() => {
      this.setState({
        isSubmitting: false
      });
    });
  };
  
  /**
   * @private
   * Creates the JSX for the summary section.
   * 
   * @return {JSX} 
   */
  _createSummaryJsx() {
    
    let items = this.state.items
    ,   itemPriceJsx = []
    ,   subTotal = this.state.totalPrice;
    
    itemPriceJsx = _.map(items, (itemInfo) => {
      let priceForVariation = itemInfo.variation.price * itemInfo.count;
      
      return (
        <div key={itemInfo.variation._id} className={styles.summaryItem}>
          <span className={styles.labelStyle}>{priceForVariation} {itemInfo.item.name}</span>
          <span className={styles.priceStyle}>{Numeral(priceForVariation).format("$0,0.00")}</span>
        </div>
      );
    });
    
    // hard coded for now
    let discount = 0
    ,   shipping = 7
    ,   tax = subTotal * 0.08
    ,   total = subTotal - discount + shipping + tax;
    
    return (
      <div className={styles.summarySection}>
        <div className={styles.sectionHeader}>
          Receipt summary
        </div>
        {itemPriceJsx}
        <div className={styles.summaryItem}>
          <span className={styles.labelStyle}>Discount</span>
          <span className={styles.priceStyle}>{Numeral(discount).format("$0,0.00")}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.labelStyle}>Subtotal</span>
          <span className={styles.priceStyle}>{Numeral(subTotal).format("$0,0.00")}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.labelStyle}>Shipping</span>
          <span className={styles.priceStyle}>{Numeral(shipping).format("$0,0.00")}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.labelStyle}>Tax</span>
          <span className={styles.priceStyle}>{Numeral(tax).format("$0,0.00")}</span>
        </div>
        <div className={styles.totalPrice}>
          <span>Total</span>
          <span className={styles.priceStyle}>{Numeral(total).format("$0,0.00")}</span>
        </div>
      </div>
    );
  }
  
  /**
   * @private
   * Creates the JSX for the checkout form section.
   * 
   * @return {JSX} 
   */
  _createCheckoutContentJsx() {
    
    return (
      <div>
        {this._createSummaryJsx()}
        <AlertMessage ref="alert" alertStyle="danger">
          {this.state.errorMessage}
        </AlertMessage>
        <PaymentApp
          amount={this.state.totalPrice}
          handlePayment={this._onReceivedPayment}
        >
          <SubmitButton
            submitText="Processing"
            disabled={this.state.isSubmitting} 
            isSubmitting={this.state.isSubmitting}
            block
            theme="gold"
          >
            <Glyphicon glyph="lock" />
            {' '}
            Proceed to checkout
          </SubmitButton>
        </PaymentApp>
        <div className={styles.information}>
          <Glyphicon glyph="lock" />
          {' '}
          Your card information is encrypted
        </div>
      </div>
    );
  }
  
  /**
   * @private
   * Creates the JSX for the confirmation section.
   * 
   * @return {JSX} 
   */
  _createConfirmationJsx() {
    return (
      <div>
        Thank you for shopping with us. We’ll send a confirmation when your item ships.
      </div>
    );
  }

  /**
   * @inheritdoc
   */
  render() {

    let items = this.state.items
    ,   checkoutContent = do {
      if (this.state.checkoutFinish) {
        this._createConfirmationJsx();
      } else {
        this._createCheckoutContentJsx();
      }
    };
    
    return (
      <div className={styles.checkoutApp}>
        <div className={styles.checkoutForm}>
          {checkoutContent}
        </div>
      </div>
    );
  }
}
