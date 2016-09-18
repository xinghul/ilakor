import _ from "lodash";

import React from "react";
import { Row, Col } from "react-bootstrap";

import SimpleTable from "lib/SimpleTable";

import AddBrandForm from "./BrandManageApp/AddBrandForm";

import BrandManageAction from "actions/item/BrandManageAction";
import BrandManageStore from "stores/item/BrandManageStore";

import styles from "components/ManageApp/BrandManageApp.scss";

function getStateFromStores() {
  return {
    brands: BrandManageStore.getBrands()
  };
}

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
    BrandManageStore.addChangeListener(this._onChange);
    
    BrandManageAction.getBrands();
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    BrandManageStore.removeChangeListener(this._onChange);
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
