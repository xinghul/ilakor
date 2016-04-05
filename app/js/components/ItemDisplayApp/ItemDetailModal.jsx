"use strict"

import React from "react"
import CSSModules from "react-css-modules"
import { Modal, Button, Input } from "react-bootstrap"

import styles from "./ItemDetailModal.css"

class ItemDetailModal extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  onClose() {
    this.props.onClose();
  }
  
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
      <Modal show={this.props.showModal} onHide={this.onClose.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.item.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {itemDetailJsx}
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="warning">Add to cart</Button>  
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

export default CSSModules(ItemDetailModal, styles)