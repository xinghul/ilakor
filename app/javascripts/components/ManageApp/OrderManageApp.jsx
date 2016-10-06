import React from "react";
import _ from "lodash";
import invariant from "invariant";

import { Row, Col } from "react-bootstrap";

import OrderManageStore from "stores/OrderManageStore";
import OrderAction from "actions/OrderAction";

import GridSection from "lib/GridSection";
import DataTable from "lib/DataTable";

import OrderDetailModal from "./OrderManageApp/OrderDetailModal";

import styles from "components/ManageApp/OrderManageApp.scss";

// brands table key to header
const columnKeyToHeader = {
  "_id": "Id",
  "items": "Items",
  "charge.amount": "Amount",
  "payment.email": "Email",
  "sent": "Order sent"
};

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

/**
 * @class
 * @extends {React.Component}
 */
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
    OrderManageStore.subscribe(this._onChange);
    
    OrderAction.getOrders();    
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    OrderManageStore.unsubscribe(this._onChange);
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
   * @param  {Object} selectedOrder the selected order.
   */
  _onOrderSelect = (selectedOrder) => {
    
    const { orders } = this.state;
    
    let selectedOrderIndex = orders.indexOf(selectedOrder);

    this.setState({
      selectedOrderIndex: selectedOrderIndex
    });
    
    this.refs["orderModal"].showModal();
  };
  
  /**
   * @inheritdoc
   */
  render() {
    
    const { orders, selectedOrderIndex } = this.state;
    
    let selectedOrder = orders[selectedOrderIndex] || {};
    
    return (
      <div className={styles.orderManageApp}>
        <OrderDetailModal 
          ref="orderModal"
          order={selectedOrder} 
        />
        <Row>
          <Col xs={12} md={6}>
            <DataTable
              data={orders} 
              columnKeyToHeader={columnKeyToHeader} 
              onRowSelect={this._onOrderSelect}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
