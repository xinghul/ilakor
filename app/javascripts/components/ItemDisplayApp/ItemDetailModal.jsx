import React from "react";
import invariant from "invariant";
import _ from "lodash";
import { Modal, Row, Col, Accordion, Panel } from "react-bootstrap";

import GhostButton from "lib/GhostButton";
import BaseCarousel from "lib/BaseCarousel";
import SingleRangeSlider from "lib/SingleRangeSlider";
import Select from "lib/Select";
import Input from "lib/Input";

import ShoppingCartAction from "actions/ShoppingCartAction";

import styles from "components/ItemDisplayApp/ItemDetailModal.scss";

/**
 * Creates the options for Select component.
 * 
 * @method createSelectOptions
 *
 * @param {Array} options the options.
 * 
 * @return {Array}
 */
function createSelectOptions(options) {
  return _.map(options, (option) => {
    return {
      label: _.capitalize(_.words(option).join(' ')),
      value: option
    };
  });
}

/**
 * @class
 * @extends {React.Component}
 */
export default class ItemDetailModal extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      showModal: false,
      // current selected values
      config: {},
      variations: {},
      selectionKeys: []
    };
  }
  
  /**
   * @inheritdoc
   */
  componentWillReceiveProps(props) {
    
    const variationRaw = props.item && props.item.variations;

    let variations = {}
    ,   selectionKeys = [];
    
    // gets all the variation info and stores into the array
    // also gets all the unique key, for each key, we will have a Select for it
    _.forEach(variationRaw, (variation) => {
      variations[variation._id] = variation.info;
      
      _.forEach(variation.info, (value, key) => {
        if (selectionKeys.indexOf(key) === -1) {
          selectionKeys.push(key);
        }
      })
    });
    
    this.setState({
      variations,
      selectionKeys
    });
    
  }
  
  /**
   * @private
   * Handler for closing the modal.
   */
  _closeModal = () => {
    this.setState({
      showModal: false
    });
  };
  
  /**
   * Shows the modal.
   */
  showModal() {
    this.setState({
      showModal: true
    });
  }
  
  /**
   * @private
   * Handler for when 'Add to cart' button is clicked.
   */
  _onAddToCartClick = () => {
    
    invariant(!_.isEmpty(this.props.item), `this.props.item shouldn't be empty when _onAddToCartClick() is called.`);
        
    const { config } = this.state;
    const { variations } = this.props.item;
    
    let selectedVariation = {};
    
    _.forEach(variations, (variationRaw) => {
      let variation = variationRaw.info;
      
      if (_.isMatch(variation, config)) {
        selectedVariation = variationRaw;
      } 
    })
    
    let itemInfo = {
      count: this.refs["quantity"].getValue(),
      item: this.props.item,
      variation: selectedVariation
    };
    
    ShoppingCartAction
    .addToCart(itemInfo)
    .finally(() => {
      this._closeModal();
    });
  };
  
  /**
   * @private
   * Handler for when one of the Select value changes.
   * Updates the select options based on newly selected value.
   * 
   * @param  {String} key the newly selected key.
   * @param  {String} value the newly selected value.
   */
  _onSelectionChange = (key, value) => {
    
    let { config } = this.state;

    if (_.isEmpty(value)) {
      delete config[key];      
    } else {
      config[key] = value;
    }
    
    this.setState({
      config
    });
  };
  
  /**
   * @private
   * Creates the JSX for the description section.
   *
   * @return {JSX}
   */
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
    
    const { config, variations, selectionKeys } = this.state;

    // creates the Select group
    let selectGroup = _.map(selectionKeys, (key) => {
      let newConfig = _.clone(config);

      delete newConfig[key];
      
      let availableVariations = _.filter(_.values(variations), newConfig);

      let value = [];
      _.forEach(availableVariations, (variation) => {
        if (!_.isEmpty(variation[key]) && value.indexOf(variation[key]) === -1) {
          value.push(variation[key]);
        }
      });
      
      value.sort();

      let options = createSelectOptions(value);
      
      let defaultValue = _.isEmpty(config[key]) ? null : config[key];

      return (
        <Select 
          key={_.uniqueId(key)}
          defaultValue={defaultValue}
          multi={false}
          placeholder={`Select ${key}...`}
          options={options}
          onChange={this._onSelectionChange.bind(this, key)}
        />
      );
    });
    
    return (
      <div className={styles.configSection}>
        {selectGroup}
        <Input
          ref="quantity"
          defaultValue="1"
          label="Quantity"
        />
        <GhostButton theme="gold" onClick={this._onAddToCartClick}>Add to cart</GhostButton> 
      </div>
    );
  }
  
  /**
   * Creates the JSX for the item detail.
   * 
   * @return {JSX}
   */
  _createModalBody() {
    const { item } = this.props;
    
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
                  No reviews.
                </Panel>
                <Panel header="FAQ" eventKey="2">
                  No FAQs.
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
    
    const { showModal } = this.state;
    const { item } = this.props;
    
    if (_.isEmpty(item)) {
      return null;
    }
    
    return (
      <Modal
        bsSize="large"
        className={styles.itemDetailModal} 
        show={showModal} 
        onHide={this._closeModal}
      >
        <Modal.Body>
          {this._createModalBody()}
        </Modal.Body>
        <Modal.Footer>
          <GhostButton theme="black" onClick={this._closeModal}>Close</GhostButton> 
        </Modal.Footer>
      </Modal>
    );
    
  }
}

ItemDetailModal.propTypes = { 
  item: React.PropTypes.object
};

ItemDetailModal.defaultProps = {
  item: null
};