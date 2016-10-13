import _ from "lodash";

import React from "react";
import { Row, Col } from "react-bootstrap";

import DataTable from "lib/DataTable";

import AddBrandForm from "./BrandManageApp/AddBrandForm";

import BrandManageAction from "actions/item/BrandManageAction";
import BrandManageStore from "stores/item/BrandManageStore";

import styles from "components/ManageApp/BrandManageApp.scss";

// brands table key to header
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
    brands: BrandManageStore.getBrands(),
    
    isLoading: BrandManageStore.getIsLoading()
  };
}

/**
 * @class
 * @extends {React.Component}
 */
export default class BrandManageApp extends React.Component {
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = _.merge(getStateFromStores(), {
      selectedData: null
    });
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    BrandManageStore.subscribe(this._onChange);
    
    BrandManageAction.getBrands(true);
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    BrandManageStore.unsubscribe(this._onChange);
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
    
    const { brands, isLoading } = this.state;

    return (
      <div className={styles.brandManageApp}>
        <Row>
          <Col xs={12} md={6}>
            <AddBrandForm />
          </Col>
          <Col xs={12} md={6}>
            <DataTable
              data={brands} 
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
