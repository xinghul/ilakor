import React from "react";
import invariant from "invariant";
import _ from "lodash";
import Numeral from "numeral";
import { Modal, Row, Col, Accordion, Panel } from "react-bootstrap";

import GhostButton from "lib/GhostButton";
import BaseCarousel from "lib/BaseCarousel";
import Select from "lib/Select";
import Input from "lib/Input";
import AlertMessage from "lib/AlertMessage";

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
      selectionKeys: [],
      availableVariations: [],
      errorMessage: ""
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
      });
    });
    
    this.setState({
      variations,
      selectionKeys,
      availableVariations: variationRaw
    });
    
  }
  
  /**
   * @private
   * Handler for closing the modal.
   */
  _closeModal = () => {
    this.setState({
      showModal: false,
      config: {},
      errorMessage: ""
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
  
  
  /**
   * @private
   * Handler for when 'Add to cart' button is clicked.
   */
  _onAddToCartClick = () => {
    
    invariant(!_.isEmpty(this.props.item), `this.props.item shouldn't be empty when _onAddToCartClick() is called.`);
    const { availableVariations } = this.state;
    
    let count = _.toInteger(this.refs["quantity"].getValue());
    
    if (!_.inRange(count, 1, 10)) {
      this.setState({
        errorMessage: "Please enter a valid count(1 to 9)."
      });
      
      this.refs["errorMessage"].show();
    } else if (availableVariations.length > 1) {
      this.setState({
        errorMessage: "Please select flavor and size."
      });
      
      this.refs["errorMessage"].show();
    } else {
      // success 
      let itemInfo = {
        count,
        item: this.props.item,
        variation: availableVariations[0]
      };
      
      ShoppingCartAction
      .addToCart(itemInfo)
      .finally(() => {
        this._closeModal();
      });
    }
    
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
    const { variations } = this.props.item;

    if (_.isEmpty(value)) {
      // reset config when clear is clicked
      config = {};     
    } else {
      config[key] = value;
    }
    
    let availableVariations = [];
    
    _.forEach(variations, (variation) => {
      if (_.isMatch(variation.info, config)) {
        availableVariations.push(variation);
      }
    });
    
    this.setState({
      config,
      availableVariations
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
   * Creates the JSX for the features section.
   *
   * @return {JSX}
   */
  _createFeaturesSectionJsx() {
    
    const { features } = this.props.item;
    
    let featureItems = _.map(features, (feature) => {
      return (
        <div key={_.uniqueId(feature.key)} className={styles.featureItem}>
          <div className={styles.featureKey}>
            {feature.key}
          </div>
          <div className={styles.featureValue}>
            {feature.value}
          </div>
        </div>
      );
    });
    
    return (
      <div className={styles.featureSection}>
        {featureItems}
      </div>
    );
  }
  
  /**
   * @private
   * Creates the section for selecting flavors, sizes and quantities.
   * 
   * @return {JSX} 
   */
  _createConfigSectionJsx() {
    
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
      
      let defaultValue = !_.isEmpty(config[key]) ? config[key]
                                                 : (options.length === 1 ? options[0].value : null);

      return (
        <Row key={_.uniqueId(key)}>
          <Col md={8} xs={12}>
            <Select 
              defaultValue={defaultValue}
              multi={false}
              placeholder={`Select ${key}...`}
              options={options}
              onChange={this._onSelectionChange.bind(this, key)}
            />
          </Col>
        </Row>
      );
    });
    
    return (
      <div className={styles.configSection}>
        {this._createPriceSectionJsx()}
        {selectGroup}
        <Row>
          <Col md={4} xs={6}>
            <Input
              shrink={true}
              ref="quantity"
              defaultValue="1"
              label="Quantity"
            />
          </Col>
          <Col md={4} xs={6}>
            <GhostButton block theme="gold" onClick={this._onAddToCartClick}>Add to cart</GhostButton>
          </Col>
        </Row>
      </div>
    );
  }
  
  /**
   * Creates the JSX for the price section.
   * 
   * @return {JSX}
   */
  _createPriceSectionJsx() {
    
    const { availableVariations } = this.state;
    
    invariant(availableVariations.length >= 1, `availableVariations should not be empty.`);

    return (
      <div className={styles.priceSection}>
        {do {
          if (availableVariations.length > 1) {
            <span>from </span>
          } else {
            null
          }
        }}
        <span className={styles.price}>{Numeral(availableVariations[0].price).format("$0,0.00")}</span>
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
    const { errorMessage } = this.state;
    
    let imageUrls = item.images.map((image) => {
      invariant(_.isString(image.name), `Each image of item.images should have a 'name' as string.`);
      
      return "http://d16knxx0wtupz9.cloudfront.net/" + image.name;
    });
    
    return (
      <div className={styles.mainContent}>
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
          <Row>
            <Col md={6} xs={12}>
              <div className={styles.category}>{item.category.name} PRODUCT</div>
            </Col>
            <Col md={6} xs={12}>
              <div className={styles.brand}>{item.brand.name}</div>
            </Col>
          </Row>
          <div className={styles.name}>{item.name}</div> 
          {this._createFeaturesSectionJsx()}
          <div className={styles.description}>
            {this._createItemDescriptionJsx()}
          </div>
          {this._createConfigSectionJsx()}
          <AlertMessage 
            ref="errorMessage"
            alertStyle="danger" 
          >{errorMessage}</AlertMessage>
        </div>
      </div>
    );
  }
}

ItemDetailModal.propTypes = { 
  item: React.PropTypes.object
};

ItemDetailModal.defaultProps = {
  item: null
};