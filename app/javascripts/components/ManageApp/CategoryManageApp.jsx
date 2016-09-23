import _ from "lodash";

import React from "react";
import { Row, Col } from "react-bootstrap";

import SimpleTable from "lib/SimpleTable";

import AddCategoryForm from "./CategoryManageApp/AddCategoryForm";

import CategoryManageAction from "actions/item/CategoryManageAction";
import CategoryManageStore from "stores/item/CategoryManageStore";

import styles from "components/ManageApp/CategoryManageApp.scss";

/**
 * Gets the new state from subscribed stores.
 * 
 * @return {Object}
 */
function getStateFromStores() {
  return {
    categories: CategoryManageStore.getCategories()
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
      categories: CategoryManageStore.getCategories()
    };
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    CategoryManageStore.addChangeListener(this._onChange);
    
    CategoryManageAction.getCategories(true);
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    CategoryManageStore.removeChangeListener(this._onChange);
  }
  
  /**
   * @private
   * Handler for when subscribed stores emit 'change' event.
   */
  _onChange = () => {
    this.setState(getStateFromStores());
  };
  
  /**
   * @inheritdoc
   */
  render() {

    return (
      <div className={styles.categoryManageApp}>
        <Row>
          <Col xs={12} md={6}>
            <AddCategoryForm />
          </Col>
          <Col xs={12} md={6}>
            <SimpleTable 
              store={CategoryManageStore}
              data={this.state.categories} 
              title="Categories"
              removeHandler={CategoryManageAction.removeCategory}
            />
          </Col>
        </Row>
      </div>
    );
    
  }
  
}
