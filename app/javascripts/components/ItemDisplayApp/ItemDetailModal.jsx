"use strict"

import React from "react"
import { Modal } from "react-bootstrap"

import GhostButton from "lib/GhostButton"

import styles from "components/ItemDisplayApp/ItemDetailModal.scss"

export default class ItemDetailModal extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  onClose = () => {
    this.props.onClose();
  };
  
  createItemDetailJsx() {
    let item = this.props.item;
    
    return (
      <div>
      </div>
    );
  }

  render() {
    
    let itemDetailJsx = this.createItemDetailJsx();

    return (
      <Modal show={this.props.showModal} onHide={this.onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.item.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {itemDetailJsx}
        </Modal.Body>
        <Modal.Footer>
          <GhostButton theme="gold">Add to cart</GhostButton>  
        </Modal.Footer>
      </Modal>
    );
    
  }
}

ItemDetailModal.propTypes = { 
  showModal: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func.isRequired,
  item: React.PropTypes.object.isRequired
};

ItemDetailModal.defaultProps = {
};
