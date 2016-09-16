"use strict"

import React from "react"
import invariant from "invariant"
import _ from "lodash"
import { Modal, Row, Col, Accordion, Panel } from "react-bootstrap"

import GhostButton from "lib/GhostButton"
import BaseCarousel from "lib/BaseCarousel"
import SingleRangeSlider from "lib/SingleRangeSlider"

import ItemUtil from "utils/ItemUtil"

import ShoppingCartAction from "actions/ShoppingCartAction"

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
   * @private
   * Handler for when 'Add to cart' button is clicked.
   */
  _onAddToCartClick = () => {
    
    invariant(!_.isEmpty(this.props.item), `this.props.item shouldn't be empty when _onAddToCartClick() is called.`);
    
    ShoppingCartAction
    .addToCart(this.props.item)
    .finally(() => {
      this._onClose();
    });
  };
  
  createItemConfigJsx() {
    
    return (
      <div>
      </div>
    );
  }
  
  /**
   * Creates the JSX for the item detail.
   * 
   * @return {JSX}
   */
  createItemDetailJsx() {
    let item = this.props.item;
    
    let imageUrls = item.images.map((image) => {
      invariant(_.isString(image.name), `Each image of item.images should have a 'name' as string.`);
      
      return "http://d16knxx0wtupz9.cloudfront.net/" + image.name;
    });
    
    return (
      <div className={styles.mainContent}>
        <Row>
          <Col xs={12} md={12} className={styles.topContent}>
            <div className={styles.carouselWrapper}>
              <BaseCarousel width={450} height={450} images={imageUrls} title={item.name} />
            </div>
            <div className={styles.rightContent}>
              <div className={styles.title}>{item.name}</div>
              <div className={styles.price}>{ItemUtil.createPriceJsx(item.price)}</div>
              <div className={styles.config}>
                {this.createItemConfigJsx()}
              </div>
              <div className={styles.addCartWrapper}>
                <GhostButton theme="gold" onClick={this._onAddToCartClick}>Add to cart</GhostButton> 
              </div>
            </div>
          </Col>
        </Row>
        <Row className={styles.bottomContent}>
          <Accordion>
            <Panel header="Description" eventKey="1">
              <div className={styles.information} dangerouslySetInnerHTML={{__html: item.description}} />
            </Panel>
            <Panel header="Reviews" eventKey="2">
              Here comes the reviews.
            </Panel>
            <Panel header="FAQ" eventKey="3">
              Here comes the FAQs.
            </Panel>
          </Accordion>
        </Row>
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
        bsSize="large"
        className={styles.itemDetailModal} 
        show={this.props.showModal} 
        onHide={this._onClose}
      >
        <Modal.Body>
          {itemDetailJsx}
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