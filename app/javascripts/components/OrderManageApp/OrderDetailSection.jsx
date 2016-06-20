"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import GridSection from "lib/GridSection"
import BaseInfo from "lib/BaseInfo"
import SubmitButton from "lib/SubmitButton"

import OrderAction from "actions/OrderAction"

import styles from "components/OrderManageApp/OrderDetailSection.scss"

export default class OrderDetailSection extends React.Component {
  
  constructor(props) {
    super(props);    
    
    this.state = {
      isTakingPayment: false,
      isSendingOrder: false
    };
  }
  
  handleTakePayment = () => {
    
  };
  
  handleSendOrder = () => {
    
    let order = this.props.order;
    
    this.setState({
      isSendingOrder: true
    });
    
    OrderAction.updateOrder(
      order._id,
      {sent: true}
    ).then(() => {
      
    }).catch((err) => {
      
    }).finally(() => {
      this.setState({
        isSendingOrder: false
      });
    });
  };
  
  createActionButtons() {
    let order = this.props.order
    ,   buttonDisabled = this.state.isTakingPayment || this.state.isSendingOrder;

    return (
      <div className={styles.actionButtons}>
        <SubmitButton 
          bsStyle="warning" 
          disabled={order.stripe.captured || buttonDisabled}
          isSubmitting={this.state.isTakingPayment}
          handleSubmit={this.handleTakePayment}
        >Take payment</SubmitButton>
        <SubmitButton 
          bsStyle="success"
          disabled={order.sent || buttonDisabled}
          isSubmitting={this.state.isSendingOrder}
          handleSubmit={this.handleSendOrder}
        >Send order</SubmitButton>  
      </div>
    );
  }
  
  render() {
    
    let order = this.props.order;
    
    if (_.isEmpty(order)) {
      return null;
    }
    
    let actionButtons = this.createActionButtons();
    
    return (
      <GridSection title="Order information" className={styles.orderDetailSection}>
        <BaseInfo label="Id" text={order._id} />
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
