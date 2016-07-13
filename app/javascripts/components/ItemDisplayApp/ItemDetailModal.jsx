"use strict"

import React from "react"
import invariant from "invariant"
import _ from "lodash"
import { Modal } from "react-bootstrap"

import GhostButton from "lib/GhostButton"
import BaseCarousel from "lib/BaseCarousel"

import styles from "components/ItemDisplayApp/ItemDetailModal.scss"

export default class ItemDetailModal extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
  }
  
  /**
   * @private
   * Triggers for closing the modal.
   */
  _onClose = () => {
    this.props.onClose();
  };
  
  /**
   * Creates the JSX for the item detail.
   * 
   * @return {JSX}
   */
  createItemDetailJsx() {
    let item = this.props.item;
    
    let imageUrls = item.images.map((image) => {
      invariant(_.isString(image.name), `Each image of item.images should have a 'name' as string.`);
      
      return "http://d2nl38chx1zeob.cloudfront.net/" + image.name;
    });
    
    return (
      <div className={styles.mainContent}>
        <BaseCarousel images={imageUrls} title={item.name} />
      </div>
    );
  }

  /**
   * @inheritdoc
   */
  render() {
    
    if (_.isEmpty(this.props.item)) {
      return null;
    }
    
    let itemDetailJsx = this.createItemDetailJsx();

    return (
      <Modal 
        className={styles.itemDetailModal} 
        show={this.props.showModal} 
        onHide={this._onClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.props.item.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {itemDetailJsx}
          <GhostButton theme="gold">Add to cart</GhostButton> 
        </Modal.Body>
        <Modal.Footer>
          <GhostButton theme="black" onClick={this._onClose}>Close</GhostButton> 
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