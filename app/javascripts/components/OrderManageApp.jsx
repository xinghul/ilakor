"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import { Table } from "react-bootstrap"

import OrderManageStore from "stores/OrderManageStore"
import OrderAction from "actions/OrderAction"

import GridSection from "lib/GridSection"
import OrderDetailModal from "./OrderManageApp/OrderDetailModal"

import styles from "components/OrderManageApp.scss"

function getStateFromStores() {
  return {
    orders: OrderManageStore.getOrders()
  };
}

export default class OrderManageApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      orders: OrderManageStore.getOrders(),
      
      selectedOrderIndex: 0
    };
  }
  
  componentDidMount() {
    OrderManageStore.addChangeListener(this._onChange);
    
    OrderAction.getOrders();    
  }
  
  componentWillUnmount() {
    OrderManageStore.removeChangeListener(this._onChange);
  }
  
  _onChange = () => {
    this.setState(getStateFromStores());
  };
  
  handleOrderClick = (index) => {
    console.log(index);
    this.setState({
      selectedOrderIndex: index
    });
    
    this.refs["orderModal"].showModal();
  };
  
  createOrdersTable(orders) {
    
    invariant(_.isArray(orders), `createOrdersTable() expects an 'array', but gets '${typeof orders}'.`);
    
    let tableBody = [];
    
    for (let order of orders)
    {
      tableBody.push(
        <tr onClick={this.handleOrderClick.bind(this, orders.indexOf(order))} key={order._id}>
          <td>{orders.indexOf(order)}</td>
          <td>{order._id}</td>
          <td>{order.charge.amount}</td>
          <td>{order.user.email}</td>
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
  
  render() {
    
    let ordersTable = this.createOrdersTable(this.state.orders);
    
    let selectedOrder = {};
    if (!_.isEmpty(this.state.orders)) {
      selectedOrder = this.state.orders[this.state.selectedOrderIndex];
    }
    
    return (
      <div className={styles.orderManageApp}>
        <OrderDetailModal 
          ref="orderModal"
          order={selectedOrder} 
        />
        <GridSection title="Orders">
          {ordersTable}
        </GridSection>
      </div>
    );
  }
}
