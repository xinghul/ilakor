"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import { Modal } from "react-bootstrap"

import styles from "components/OrderManageApp/OrderDetailModal.scss"

export default class OrderDetailModal extends React.Component {
  
  constructor(props) {
    super(props);    
  }
  
  render() {
    
    return (
      <div className={styles.orderDetailModal}>
      </div>
    );
  }
}
