"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import { Modal, Row, Col } from "react-bootstrap"

import SubmitButton from "lib/SubmitButton"
import GhostButton from "lib/GhostButton"
import BaseInfo from "lib/BaseInfo"
import CustomerDetailSection from "./CustomerDetailSection"
import AddressDetailSection from "./AddressDetailSection"
import ItemDetailSection from "./ItemDetailSection"
import OrderDetailSection from "./OrderDetailSection"

import styles from "components/OrderManageApp/OrderDetailModal.scss"

export default class OrderDetailModal extends React.Component {
  
  constructor(props) {
    super(props);    
    
    this.state = {
      showModal: false
    };
  }
  
  showModal() {
    this.setState({
      showModal: true
    });
  }
  
  onClose = () => {
    this.setState({
      showModal: false  
    });
  };
  
  render() {
    
    let order = this.props.order;
    
    if (_.isEmpty(order)) {
      return null;
    }
        
    return (
      <Modal className={styles.orderDetailModal} show={this.state.showModal} onHide={this.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Order {order._id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Row>
              <Col md={5} xs={12}>
                <CustomerDetailSection user={order.user} />
                <AddressDetailSection address={order.address} />
              </Col>
              <Col md={7} xs={12}>
                <OrderDetailSection order={order} />
                <ItemDetailSection items={order.items} />
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <GhostButton theme="black" onClick={this.onClose}>Close</GhostButton>  
        </Modal.Footer>
      </Modal>
    );
  }
}

OrderDetailModal.propTypes = {
  order: React.PropTypes.object.isRequired  
};

OrderDetailModal.defaultProps = {
};
