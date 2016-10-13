import _ from "lodash";

import React from "react";
import { Row, Col } from "react-bootstrap";

import DataTable from "lib/DataTable";

import AddCategoryForm from "./CategoryManageApp/AddCategoryForm";

import CategoryManageAction from "actions/item/CategoryManageAction";
import CategoryManageStore from "stores/item/CategoryManageStore";

import styles from "components/ManageApp/CategoryManageApp.scss";

// categories table key to header
const columnKeyToHeader = {
  "_id": "Id",
  "name": "Name"
};

/**
 * Gets the new state from subscribed stores.
 * 
 * @return {Object}
 */
function getStateFromStores() {
  return {
    categories: CategoryManageStore.getCategories(),
    isLoading: CategoryManageStore.getIsLoading()
  };
}

/**
 * @class
 * @extends {React.Component}
 */
export default class CategoryManageApp extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      categories: CategoryManageStore.getCategories(),
      isLoading: CategoryManageStore.getIsLoading(),
      
      selectedData: null
    };
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    CategoryManageStore.subscribe(this._onChange);
    
    CategoryManageAction.getCategories(true);
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    CategoryManageStore.unsubscribe(this._onChange);
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
      selectedData
    });
  };
  
  /**
   * @inheritdoc
   */
  render() {
    
    const { categories, isLoading } = this.state;

    return (
      <div className={styles.categoryManageApp}>
        <Row>
          <Col xs={12} md={6}>
            <AddCategoryForm />
          </Col>
          <Col xs={12} md={6}>
            <DataTable
              data={categories} 
              columnKeyToHeader={columnKeyToHeader} 
              onRowSelect={this._onRowSelect}
              isLoading={isLoading}
            />
          </Col>
        </Row>
      </div>
    );
    
  }
  
}
