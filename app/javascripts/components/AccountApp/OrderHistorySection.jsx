"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"
import { Table } from "react-bootstrap"

import GridSection from "lib/GridSection"
import LoadSpinner from "lib/LoadSpinner"

import AccountStore from "stores/AccountStore"

import AccountAction from "actions/AccountAction"

import styles from "components/AccountApp/OrderHistorySection.scss"

/**
 * Gets the new state from subscribed stores.
 * 
 * @return {Object}
 */
function getStateFromStores() {
  return {
    orders: AccountStore.getOrders(),
    isLoading: AccountStore.getIsLoading()
  };
}

export default class OrderHistorySection extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = getStateFromStores();
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    AccountStore.subscribe(this._onChange);

    AccountAction.getOrders(this.props.user._id);
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    AccountStore.unsubscribe(this._onChange);
  }
  
  /**
   * @private
   * Handler for when subscribed stores emit 'change' event.
   */
  _onChange = () => {
    this.setState(getStateFromStores());
  };
  
  /**
   * Creates the orders table JSX.
   * 
   * @return {JSX}
   */
  createOrdersTable() {
    let orders = this.state.orders
    ,   tableBody = [];
    
    for (let order of orders)
    {
      tableBody.push(
        <tr key={order._id}>
          <td>{orders.indexOf(order)}</td>
          <td>{order._id}</td>
          <td>{order.created}</td>
          <td>{order.stripe.amount.toString()}</td>
          <td>{order.sent ? "Yes" : "No"}</td>
        </tr>
      );
    }
    
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Id</th>
            <th>Created</th>
            <th>Amount</th>
            <th>Sent</th>
          </tr>
        </thead>
        <tbody>
          {tableBody}
        </tbody>
      </Table>
    );
  }
  
  /**
   * @inheritdoc
   */
  render() {
    
    let orders = this.state.orders;
    
    return (
      <GridSection title="Order history" className={styles.orderHistorySection}>
        {do {
          if (this.state.isLoading) {
            <LoadSpinner className={styles.loadSpinner} />;
          } else {
            this.createOrdersTable();
          }
        }}
      </GridSection>
    );
  }
}

OrderHistorySection.propTypes = {
  user: React.PropTypes.object.isRequired
};
