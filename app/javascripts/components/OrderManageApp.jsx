"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import { Table } from "react-bootstrap"

import OrderManageStore from "stores/OrderManageStore"
import OrderAction from "actions/OrderAction"

import styles from "components/OrderManageApp.scss"

function getStateFromStores() {
  return {
    orders: OrderManageStore.getOrders()
  };
}

export default class OrderManageApp extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = getStateFromStores();
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
  
  render() {
    
    return (
      <div className={styles.orderManageApp}>
      </div>
    );
  }
}
