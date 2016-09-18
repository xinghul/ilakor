"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import { Table } from "react-bootstrap"

import OrderManageStore from "stores/OrderManageStore"
import OrderAction from "actions/OrderAction"

import GridSection from "lib/GridSection"
import LoadSpinner from "lib/LoadSpinner"

import OrderDetailModal from "./OrderManageApp/OrderDetailModal"

import styles from "components/ManageApp/OrderManageApp.scss"

/**
 * Gets the new state from subscribed stores.
 * 
 * @return {Object}
 */
function getStateFromStores() {
  return {
    orders: OrderManageStore.getOrders(),
    isLoading: OrderManageStore.getIsLoading()
  };
}

export default class OrderManageApp extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      orders: OrderManageStore.getOrders(),
      isLoading: OrderManageStore.getIsLoading(),
      
      // use selected order index instead of selected order
      // so order detail modal will be updated once a change is made
      selectedOrderIndex: 0
    };
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    OrderManageStore.addChangeListener(this._onChange);
    
    OrderAction.getOrders();    
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    OrderManageStore.removeChangeListener(this._onChange);
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
   * Handler for when a order in the table is clicked.
   * 
   * @param  {Number} selectedOrderIndex the selected order index.
   */
  _onOrderClick = (selectedOrderIndex) => {

    this.setState({
      selectedOrderIndex: selectedOrderIndex
    });
    
    this.refs["orderModal"].showModal();
  };
  
  /**
   * @private
   * Renders the order list table.
   *
   * @return {JSX}
   */
  _renderOrderListTable() {
    
    let orders = this.state.orders    
    ,   tableBody = [];
    
    for (let order of orders)
    {
      tableBody.push(
        <tr onClick={this._onOrderClick.bind(this, orders.indexOf(order))} key={order._id}>
          <td>{orders.indexOf(order)}</td>
          <td>{order._id}</td>
          <td>{order.charge.amount}</td>
          <td>{order.payment.email}</td>
          <td>{order.items.length}</td>
          <td>{order.sent ? "Yes" : "No"}</td>
        </tr>
      );
    }
    
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Order id</th>
            <th>Amount</th>
            <th>Customer email</th>
            <th>Items</th>
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
    
    let selectedOrder = this.state.orders[this.state.selectedOrderIndex] || {};
    
    return (
      <div className={styles.orderManageApp}>
        <OrderDetailModal 
          ref="orderModal"
          order={selectedOrder} 
        />
        <GridSection title="Orders">
          {do {
            if (this.state.isLoading) {
              <LoadSpinner className={styles.loadSpinner} />;
            } else {
              this._renderOrderListTable();
            }
          }}
        </GridSection>
      </div>
    );
  }
}
