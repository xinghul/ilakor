import _ from "lodash";
import React from "react";
import { Row, Col } from "react-bootstrap";

import ItemDetailModal from "./ItemManageApp/ItemDetailModal";
import ItemListTable from "./ItemManageApp/ItemListTable";
import AddItemForm from "./ItemManageApp/AddItemForm";

import ItemManageStore from "stores/item/ItemManageStore";
import BrandManageStore from "stores/item/BrandManageStore";
import CategoryManageStore from "stores/item/CategoryManageStore";
import TagManageStore from "stores/item/TagManageStore";

import ItemManageAction from "actions/item/ItemManageAction";

import styles from "components/ManageApp/ItemManageApp.scss";

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
    tags: TagManageStore.getTags()
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
    
    this.state = {
      items: ItemManageStore.getItems(),
      brands: BrandManageStore.getBrands(),
      categories: CategoryManageStore.getCategories(),
      tags: TagManageStore.getTags(),
      
      selectedItem: {}
    };
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
   * Handler for item in the table being clicked.
   * 
   * @param  {Object} item the clicked item.
   */
  _onItemClick = (item) => {
    this.setState({
      selectedItem: item
    });
    
    this.refs["itemModal"].showModal();
  };  
  
  /**
   * @inheritdoc
   */
  render() {
    
    return (
      <div className={styles.itemManageApp}>
        <ItemDetailModal 
          item={this.state.selectedItem}
          ref="itemModal"
        />
        <Row>
          <Col xs={12} md={6}>
            <AddItemForm 
              brands={this.state.brands}
              categories={this.state.categories}
              tags={this.state.tags} 
            />
          </Col>
          <Col xs={12} md={6}>
            <ItemListTable 
              items={this.state.items} 
              handleItemClick={this._onItemClick}
            />
          </Col>
        </Row>
      </div>
    )
  }
  
}
