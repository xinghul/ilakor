"use strict";

import React from "react"
import _ from "lodash"
import invariant from "invariant"
import { hashHistory } from "react-router"

import { Glyphicon } from "react-bootstrap"

import styles from "components/CheckoutApp.scss"

import ItemUtil from "utils/ItemUtil"

import PaymentApp from "./CheckoutApp/PaymentApp"
import SubmitButton from "lib/SubmitButton"
import AlertMessage from "lib/AlertMessage"

import ShoppingCartStore from "stores/ShoppingCartStore"
import OrderAction from "actions/OrderAction"
import AuthStore from "stores/AuthStore"

function getStateFromStores() {
  return {
    items: ShoppingCartStore.getItems(),
    totalPrice: ShoppingCartStore.getTotalPrice()
  };
}

export default class CheckoutApp extends React.Component {
  
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
  
  componentDidMount() {
    ShoppingCartStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    ShoppingCartStore.removeChangeListener(this._onChange);
  }
  
  _alertMessage = null;

  _onChange = () => {
    this.setState(getStateFromStores());
  };
  
  handlePayment = (paymentInfo, addressInfo) => {
    
    this.setState({
      isSubmitting: true
    });

    let orderInfo = {
      totalPrice: this.state.totalPrice,
      items: this.state.items,
      user: AuthStore.getUser()
    };
    
    OrderAction.addOrder(paymentInfo, addressInfo, orderInfo)
    .then((response) => {
      this.setState({
        checkoutFinish: true
      });
      
      setTimeout(() => {
        hashHistory.push("/");
      }, 3000);
    })
    .catch((err) => {
      console.log(err);
      
      let message = err.message;
      
      invariant(_.isString(message), `Expect error message to be 'string', but get '${typeof message}'.`);
      
      this.setState({
        errorMessage: message
      });
      
      this._alertMessage.showAlert();
    })
    .finally(() => {
      this.setState({
        isSubmitting: false
      });
    });
  };
  
  createSummary() {
    
    let items = this.state.items
    ,   itemPriceJsx = []
    ,   subTotle = this.state.totalPrice;

    for (let key of Object.keys(items))
    {
      let item = items[key];
      
      itemPriceJsx.push(
        <div key={key} className={styles.summaryItem}>
          <span className={styles.labelStyle}>{item.item.price} x {item.count} {item.item.name}</span>
          <span className={styles.priceStyle}>{ItemUtil.createPriceJsx(item.item.price * item.count)}</span>
        </div>
      );
    }
    
    // hard coded for now
    let discount = 0
    ,   shipping = 7
    ,   tax = subTotle * 0.08
    ,   totle = subTotle - discount + shipping + tax;
    
    return (
      <div className={styles.summarySection}>
        <div className={styles.sectionHeader}>
          Receipt summary
        </div>
        {itemPriceJsx}
        <div className={styles.summaryItem}>
          <span className={styles.labelStyle}>Discount</span>
          <span className={styles.priceStyle}>{ItemUtil.createPriceJsx(discount)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.labelStyle}>Subtotal</span>
          <span className={styles.priceStyle}>{ItemUtil.createPriceJsx(subTotle)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.labelStyle}>Shipping</span>
          <span className={styles.priceStyle}>{ItemUtil.createPriceJsx(shipping)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.labelStyle}>Tax</span>
          <span className={styles.priceStyle}>{ItemUtil.createPriceJsx(tax)}</span>
        </div>
        <div className={styles.totalPrice}>
          <span>Total</span>
          <span className={styles.priceStyle}>{ItemUtil.createPriceJsx(totle)}</span>
        </div>
      </div>
    );
  }
  
  createCheckoutContent() {
    
    return (
      <div>
        {this.createSummary()}
        <AlertMessage alertMessage={this.state.errorMessage} alertStyle="danger" ref={(component) => {
          this._alertMessage = component;
        }}/>
        <PaymentApp
          amount={this.state.totalPrice}
          handlePayment={this.handlePayment}
        >
          <SubmitButton
            submitText="Processing"
            disabled={this.state.isSubmitting} 
            isSubmitting={this.state.isSubmitting}
            block
            bsStyle="warning"
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
  
  createConfirmation() {
    return (
      <div>
        Thank you for shopping with us. We’ll send a confirmation when your item ships.
      </div>
    );
  }

  render() {

    let items = this.state.items
    ,   checkoutContent = do {
      if (this.state.checkoutFinish) {
        this.createConfirmation();
      } else {
        this.createCheckoutContent();
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
