import _ from "lodash";

import React from "react";
import { Row, Col } from "react-bootstrap";

import SimpleTable from "lib/SimpleTable";
import Select from "lib/Select";

import AddVariationForm from "./VariationManageApp/AddVariationForm";

import VariationManageAction from "actions/item/VariationManageAction";
import VariationManageStore from "stores/item/VariationManageStore";

import ItemManageAction from "actions/item/ItemManageAction";
import ItemManageStore from "stores/item/ItemManageStore";

import styles from "components/ManageApp/VariationManageApp.scss";

/**
 * Gets the new state from subscribed stores.
 * 
 * @return {Object}
 */
function getStateFromStores() {
  return {
    variations: VariationManageStore.getVariations(),
    items: ItemManageStore.getItems()
  };
}

export default class VariationManageApp extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      variations: VariationManageStore.getVariations(),
      items: ItemManageStore.getItems()
    };
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    VariationManageStore.addChangeListener(this._onChange);
    
    ItemManageStore.addChangeListener(this._onChange);
    
    VariationManageAction.getVariations(true);
    
    ItemManageAction.getItems();
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    VariationManageStore.removeChangeListener(this._onChange);
    ItemManageStore.removeChangeListener(this._onChange);
  }
  
  /**
   * @private
   * Handler for when subscribed stores emit 'change' event.
   */
  _onChange = () => {
    this.setState(getStateFromStores());
  };
  
  /**
   * @private
   * Handler for when selected item has changed, sends a new request to fetch the variations associated with the new item.
   * 
   * @param  {Object} newItem the new selected item.
   */
  _onItemChange = (newItem) => {
    let value = _.isEmpty(newItem) ? '' : newItem.value;
    
    VariationManageAction.getVariations(true, value);
  };
  
  /**
   * @inheritdoc
   */
  render() {

    return (
      <div className={styles.variationManageApp}>
        <Row>
          <Col xs={12} md={6}>
            <AddVariationForm items={this.state.items}/>
          </Col>
          <Col xs={6} md={3} className={styles.itemSelectWrapper}>
            <Select
              multi={false}
              label="Item"
              placeholder="Select item"
              options={this.state.items}
              onChange={this._onItemChange}
            />
          </Col>
          <Col xs={12} md={6}>
            <SimpleTable 
              store={VariationManageStore}
              data={this.state.variations} 
              title="Variations"
              removeHandler={VariationManageAction.removeVariation}
            />
          </Col>
        </Row>
      </div>
    );
    
  }
  
}
