import _ from "lodash";
import React from "react";
import { Row, Col } from "react-bootstrap";

import ItemDetailModal from "./ItemManageApp/ItemDetailModal";
import ItemListTable from "./ItemManageApp/ItemListTable";
import AddItemForm from "./ItemManageApp/AddItemForm";

import ItemManageAction from "actions/ItemManageAction";
import ItemManageStore from "stores/ItemManageStore";

import BrandManageAction from "actions/item/BrandManageAction";
import BrandManageStore from "stores/item/BrandManageStore";

import CategoryManageAction from "actions/item/CategoryManageAction";
import CategoryManageStore from "stores/item/CategoryManageStore";

import TagManageAction from "actions/item/TagManageAction";
import TagManageStore from "stores/item/TagManageStore";

import styles from "components/ItemManageApp.scss";

function getStateFromStores() {
  return {
    items: ItemManageStore.getItems(),
    brands: BrandManageStore.getBrands(),
    categories: CategoryManageStore.getCategories(),
    tags: TagManageStore.getTags()
  };
}

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
    ItemManageStore.addChangeListener(this._onChange);
    BrandManageStore.addChangeListener(this._onChange);
    CategoryManageStore.addChangeListener(this._onChange);
    TagManageStore.addChangeListener(this._onChange);
    
    ItemManageAction.getItems();
    
    BrandManageAction.getBrands();
    
    CategoryManageAction.getCategories();
    
    TagManageAction.getTags();
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    ItemManageStore.removeChangeListener(this._onChange);
    BrandManageStore.removeChangeListener(this._onChange);
    CategoryManageStore.removeChangeListener(this._onChange);
    TagManageStore.removeChangeListener(this._onChange);
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
