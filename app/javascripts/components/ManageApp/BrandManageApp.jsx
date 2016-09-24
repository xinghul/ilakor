import _ from "lodash";

import React from "react";
import { Row, Col } from "react-bootstrap";

import SimpleTable from "lib/SimpleTable";

import AddBrandForm from "./BrandManageApp/AddBrandForm";

import BrandManageAction from "actions/item/BrandManageAction";
import BrandManageStore from "stores/item/BrandManageStore";

import styles from "components/ManageApp/BrandManageApp.scss";

/**
 * Gets the new state from subscribed stores.
 * 
 * @return {Object}
 */
function getStateFromStores() {
  return {
    brands: BrandManageStore.getBrands()
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
    
    this.state = {
      brands: BrandManageStore.getBrands()
    };
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
   * @inheritdoc
   */
  render() {

    return (
      <div className={styles.brandManageApp}>
        <Row>
          <Col xs={12} md={6}>
            <AddBrandForm />
          </Col>
          <Col xs={12} md={6}>
            <SimpleTable 
              store={BrandManageStore}
              data={this.state.brands} 
              title="Brands"
              removeHandler={BrandManageAction.removeBrand}
            />
          </Col>
        </Row>
      </div>
    );
    
  }
  
}
