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
  
  _createItemDescriptionJsx() {
    
    const { item } = this.props;
    
    return (
      <div dangerouslySetInnerHTML={{__html: item.description}} />
    );
  }
  
  /**
   * @private
   * Creates the section for selecting flavors, sizes and quantities.
   * 
   * @return {JSX} 
   */
  _createConfigSection() {
    return (
      <div className={styles.configSection}>
        <GhostButton theme="gold" onClick={this._onAddToCartClick}>Add to cart</GhostButton> 
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
          <Col xs={12} md={12} className={styles.mainContent}>
            <div className={styles.leftContent}>
              <BaseCarousel width={450} height={450} images={imageUrls} title={item.name} />
              <Accordion>
                <Panel header="Reviews" eventKey="1">
                  Here comes the reviews.
                </Panel>
                <Panel header="FAQ" eventKey="2">
                  Here comes the FAQs.
                </Panel>
              </Accordion>
            </div>
            <div className={styles.rightContent}>
              <div className={styles.section}>
                <div className={styles.category}>{item.category.name}</div>
                <div className={styles.brand}>{item.brand.name}</div>
                <div className={styles.name}>{item.name}</div>                
              </div>
              <div className={styles.section}>
                <div className={styles.description}>
                  {this._createItemDescriptionJsx()}
                </div>
              </div>
              {this._createConfigSection()}
            </div>
          </Col>
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