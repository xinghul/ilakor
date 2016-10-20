import React from "react";
import _ from "lodash";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import invariant from "invariant";
import { hashHistory } from "react-router";

import { Glyphicon, Pager } from "react-bootstrap";

import styles from "components/CheckoutApp.scss";

import SubmitButton from "lib/SubmitButton";
import AlertMessage from "lib/AlertMessage";

import PaymentApp from "./CheckoutApp/PaymentApp";
import AddressSection from "./CheckoutApp/AddressSection";
import SummarySection from "./CheckoutApp/SummarySection";
import PaymentSection from "./CheckoutApp/PaymentSection";

import OrderAction from "actions/OrderAction";
import AuthStore from "stores/AuthStore";
import ShoppingCartStore from "stores/ShoppingCartStore";


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

    this.state = _.merge(getStateFromStores(), {
      /**
       * Indicates the step of the checkout process.
       *
       * 1. Shipping address
       * (Shipping method)
       * 2. Summary
       * 3. Payment
       *
       * @type {Number}
       */
      step: 1,

      errorMessage: "",
      isSubmitting: false,

      /**
       * The address info.
       *
       * @type {Object}
       */
      addressInfo: {}
    });
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
   * @inheritdoc
   */
  render() {

    const { items, errorMessage } = this.state;

    return (
      <div className={styles.checkoutApp}>
        <div className={styles.checkoutForm}>
          <AlertMessage ref="alert" alertStyle="danger">
            {errorMessage}
          </AlertMessage>
          {this._createCheckoutContentJsx()}
        </div>
      </div>
    );
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
   * Creates the JSX for the checkout content based on current step.
   *
   * @return {JSX}
   */
  _createCheckoutContentJsx() {

    const { step, items, totalPrice } = this.state;
    let content;

    if (step === 1) {
      // shipping address
      content = (
        <AddressSection onSubmit={this._onAddressSubmit} onError={this._onError} />
      );
    } else if (step === 2) {
      content = (
        <SummarySection items={items} totalPrice={totalPrice} onSubmit={this._onSummarySubmit} onPrevious={this._onPrevious} />
      );
      // summary
    } else if (step === 3) {
      // payment
      content = (
        <PaymentSection />
      );
    }
    
    return (
      <ReactCSSTransitionGroup transitionName="auth" 
        transitionEnterTimeout={300} 
        transitionLeaveTimeout={300}
      >
        {content}
      </ReactCSSTransitionGroup>
    );


    // return (
    //   <div>
    //     {this._createSummaryJsx()}
    //     <AlertMessage ref="alert" alertStyle="danger">
    //       {this.state.errorMessage}
    //     </AlertMessage>
    //     <PaymentApp
    //       amount={this.state.totalPrice}
    //       handlePayment={this._onReceivedPayment}
    //     >
    //       <SubmitButton
    //         submittingText="Processing"
    //         disabled={this.state.isSubmitting}
    //         isSubmitting={this.state.isSubmitting}
    //         block
    //         theme="gold"
    //       >
    //         <Glyphicon glyph="lock" />
    //         {' '}
    //         Proceed to checkout
    //       </SubmitButton>
    //     </PaymentApp>
    //     <div className={styles.information}>
    //       <Glyphicon glyph="lock" />
    //       {' '}
    //       Your card information is encrypted
    //     </div>
    //   </div>
    // );
  }
    
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
   * Handler for when the onSubmit of AddressSection is called, saves the address info.
   *
   * @param  {Object} addressInfo the address info.
   */
  _onAddressSubmit = (addressInfo) => {

    // go to next step and clear error message
    this.setState({
      step: 2,
      addressInfo: addressInfo,
      errorMessage: ""
    });
  };

  /**
   * @private
   * Handler for when receives error message from sections.
   * Display the error message with AlertMessage.
   *
   * @param  {String} errorMessage the error message.
   */
  _onError = (errorMessage) => {

    this.setState({
      errorMessage
    });

    this.refs["alert"].show();

  };

  /**
   * @private
   * Hanlder for when the previous button is clicked.
   * Goes back to the previous view.
   */
  _onPrevious = () => {
    
    const { step } = this.state;
    
    this.setState({
      step: step - 1
    });
    
  };
  
  /**
   * @private
   * Handler for when the SummarySection submit button is clicked.
   * Goes to the checkout view.
   *
   * XXX: For now, here's where we add the order.
   */
  _onSummarySubmit = () => {
    
    const { addressInfo, items, totalPrice } = this.state;
    
    this.setState({
      isSubmitting: true
    });

    let orderInfo = {
      totalPrice: totalPrice,
      items: items,
      user: AuthStore.getUser()
    };

    OrderAction.addOrder(null, addressInfo, orderInfo)
    .then((res) => {

      this.setState({
        step: 3
      });
      
    })
    .catch((errorMessage) => {
      this.setState({
        errorMessage
      });

      this.refs["alert"].show();
    })
    .finally(() => {
      this.setState({
        isSubmitting: false
      });
    });
    
  };

}
