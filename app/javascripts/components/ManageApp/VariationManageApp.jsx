import _ from "lodash";

import React from "react";
import { Row, Col } from "react-bootstrap";

import DataTable from "lib/DataTable";
import Select from "lib/Select";

import AddVariationForm from "./VariationManageApp/AddVariationForm";

import VariationManageAction from "actions/item/VariationManageAction";
import VariationManageStore from "stores/item/VariationManageStore";

import ItemManageStore from "stores/item/ItemManageStore";

import styles from "components/ManageApp/VariationManageApp.scss";

// variations table key to header
const columnKeyToHeader = {
  "_id": "Id",
  "item.name": "Item",
  "outOfStock": "Out of stock",
  "price": "Price",
  "info.flavor": "Flavor",
  "info.size": "Size"
};

/**
 * Creates the options for Select component.
 * 
 * @method createSelectOptions
 * 
 * @param  {Array} items the items used for creating the options.
 * 
 * @return {Array}
 */
function createSelectOptions(items) {
  return _.map(items, (item) => {
    return {
      label: _.capitalize(item.name),
      value: item._id
    };
  });
}

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

/**
 * @class
 * @extends {React.Component}
 */
export default class VariationManageApp extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      variations: VariationManageStore.getVariations(),
      items: ItemManageStore.getItems(),
      
      selectedData: null
    };
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    VariationManageStore.subscribe(this._onChange);
    ItemManageStore.subscribe(this._onChange);
    
    VariationManageAction.getVariations(true);
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    VariationManageStore.unsubscribe(this._onChange);
    ItemManageStore.unsubscribe(this._onChange);
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
   * Handler for when a row is selected.
   *
   * @param {Object} selectedData the selected data.
   */
  _onRowSelect = (selectedData) => {
    
    this.setState({
      selectedData: selectedData
    });
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
    
    const { variations, items } = this.state;
    
    let selectOptions = createSelectOptions(items);

    return (
      <div className={styles.variationManageApp}>
        <Row>
          <Col xs={12} md={6}>
            <AddVariationForm selectOptions={selectOptions}/>
          </Col>
          <Col xs={6} md={3} className={styles.itemSelectWrapper}>
            <Select
              multi={false}
              label="Item"
              placeholder="Select item"
              options={selectOptions}
              onChange={this._onItemChange}
            />
          </Col>
          <Col xs={12} md={6}>
            <DataTable
              data={variations} 
              columnKeyToHeader={columnKeyToHeader} 
              onRowSelect={this._onRowSelect}
            />
          </Col>
        </Row>
      </div>
    );
    
  }
  
}
