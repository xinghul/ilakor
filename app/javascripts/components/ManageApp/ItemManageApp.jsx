import _ from "lodash";
import React from "react";
import { Row, Col } from "react-bootstrap";

import DataTable from "lib/DataTable";

import ItemDetailModal from "./ItemManageApp/ItemDetailModal";
import AddItemForm from "./ItemManageApp/AddItemForm";

import ItemManageStore from "stores/item/ItemManageStore";
import BrandManageStore from "stores/item/BrandManageStore";
import CategoryManageStore from "stores/item/CategoryManageStore";
import TagManageStore from "stores/item/TagManageStore";

import ItemManageAction from "actions/item/ItemManageAction";

import styles from "components/ManageApp/ItemManageApp.scss";

// brands table key to header
const columnKeyToHeader = {
  "_id": "Id",
  "name": "Name",
  "brand.name": "Brand",
  "category.name": "Category"
};


/**
 * Gets the new state from subscribed stores.
 * 
 * @return {Object}
 */
function getStateFromStores() {
  return {
    items: ItemManageStore.getItems(),
    brands: BrandManageStore.getBrands(),
    categories: CategoryManageStore.getCategories(),
    tags: TagManageStore.getTags(),
    
    isLoading: ItemManageStore.getIsLoading()
  };
}

/**
 * @class
 * @extends {React.Component}
 */
export default class ItemManageApp extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = _.merge(getStateFromStores(), {
      selectedItem: null
    });
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    ItemManageStore.subscribe(this._onChange);
    BrandManageStore.subscribe(this._onChange);
    CategoryManageStore.subscribe(this._onChange);
    TagManageStore.subscribe(this._onChange);
    
    ItemManageAction.getItems(true);
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    ItemManageStore.unsubscribe(this._onChange);
    BrandManageStore.unsubscribe(this._onChange);
    CategoryManageStore.unsubscribe(this._onChange);
    TagManageStore.unsubscribe(this._onChange);
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
   * Handler for item in the table being selected.
   * 
   * @param  {Object} selectedItem the selected item.
   */
  _onItemSelect = (selectedItem) => {
    this.setState({
      selectedItem
    });
    
    this.refs["itemModal"].showModal();
  };  
  
  /**
   * @inheritdoc
   */
  render() {
    
    const { items, tags, brands, categories, isLoading, selectedItem } = this.state;
    
    return (
      <div className={styles.itemManageApp}>
        <ItemDetailModal 
          item={selectedItem}
          ref="itemModal"
        />
        <Row>
          <Col xs={12} md={6}>
            <AddItemForm 
              brands={brands}
              categories={categories}
              tags={tags} 
            />
          </Col>
          <Col xs={12} md={6}>
            <DataTable
              data={items} 
              columnKeyToHeader={columnKeyToHeader} 
              onRowSelect={this._onItemSelect}
              isLoading={isLoading}
            />
          </Col>
        </Row>
      </div>
    )
  }
  
}
