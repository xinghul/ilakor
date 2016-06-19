"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import { Modal } from "react-bootstrap"

import SubmitButton from "lib/SubmitButton"
import GhostButton from "lib/GhostButton"

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
    console.log(this.props.order);
    
    return (
      <Modal className={styles.orderDetailModal} show={this.state.showModal} onHide={this.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Order info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Order detail
        </Modal.Body>
        <Modal.Footer>
          <GhostButton color="black" onClick={this.onClose}>Close</GhostButton>  
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
