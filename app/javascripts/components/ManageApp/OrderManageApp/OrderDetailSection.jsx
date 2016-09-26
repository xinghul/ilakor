import React from "react";
import _ from "lodash";
import invariant from "invariant";

import GridSection from "lib/GridSection";
import BaseInfo from "lib/BaseInfo";
import SubmitButton from "lib/SubmitButton";

import OrderAction from "actions/OrderAction";

import styles from "components/ManageApp/OrderManageApp/OrderDetailSection.scss";

/**
 * @class
 * @extends {React.Component}
 */
export default class OrderDetailSection extends React.Component {
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);    
    
    this.state = {
      isTakingPayment: false,
      isSendingOrder: false
    };
  }
  
  /**
   * @private
   * Handler for when the payment is taken.
   */
  _onTakePayment = () => {
    
  };
  
  /**
   * @private
   * Handler for when the order is sent.
   */
  _onSendOrder = () => {
    
    let order = this.props.order;
    
    this.setState({
      isSendingOrder: true
    });
    
    OrderAction.updateOrder(
      order._id,
      { sent: true }
    ).then(() => {
      
    }).catch((message) => {
      
    }).finally(() => {
      this.setState({
        isSendingOrder: false
      });
    });
  };
  
  /**
   * Creates the JSX for the actionbutton group.
   * @return {[type]}                [description]
   */
  _createActionButtonsJsx() {
    
    const { order } = this.props;
    
    let actionInProcess = this.state.isTakingPayment || this.state.isSendingOrder
    ,   paymentTaken = order.stripe.captured
    ,   orderSent = order.sent;

    return (
      <div className={styles.actionButtons}>
        <SubmitButton 
          theme="warning" 
          disabled={paymentTaken || actionInProcess}
          isSubmitting={this.state.isTakingPayment}
          handleSubmit={this._onTakePayment}
        >{paymentTaken ? "Payment taken" : "Take payment"}</SubmitButton>
        <SubmitButton 
          theme="success"
          disabled={orderSent || actionInProcess}
          isSubmitting={this.state.isSendingOrder}
          handleSubmit={this._onSendOrder}
        >{orderSent ? "Order sent" : "Send order"}</SubmitButton>  
      </div>
    );
  }
  
  render() {
    
    let order = this.props.order;
    
    if (_.isEmpty(order)) {
      return null;
    }
    
    let actionButtons = this._createActionButtonsJsx();
    
    return (
      <GridSection title="Order information" className={styles.orderDetailSection}>
        <BaseInfo label="Id" text={order._id} />
        <BaseInfo label="Created" icon="clock-o" text={order.created} />
        <BaseInfo label="Amount" icon="shopping-cart" text={order.stripe.amount.toString()} />
        <BaseInfo label="Paid" icon="money" text={order.stripe.captured ? "Yes" : "No"} />
        <BaseInfo label="Sent" icon="mail-forward" text={order.sent ? "Yes" : "No"} />
        {actionButtons}
      </GridSection>
    );
  }
}

OrderDetailSection.propTypes = {
  order: React.PropTypes.object
};

OrderDetailSection.defaultProps = {
  order: {}
};
