import React from "react";
import _ from "lodash";
import invariant from "invariant";

import { Table } from "react-bootstrap";

import GridSection from "lib/GridSection";
import BaseInfo from "lib/BaseInfo";

import styles from "components/ManageApp/OrderManageApp/ItemDetailSection.scss";

export default class ItemDetailSection extends React.Component {
  
  constructor(props) {
    super(props);    
  }
  
  _createItemDetailTable() {
    let items = this.props.items;

    let tableBody = _.map(items, (itemInfo, index) => {

      return (
        <tr key={_.uniqueId(itemInfo.variation._id)}>
          <td>{index}</td>
          <td>{itemInfo.item.name}</td>
          <td>{itemInfo.count}</td>
          <td>{itemInfo.variation.price}</td>
          <td>{itemInfo.item._id}</td>
          <td>{itemInfo.variation._id}</td>
        </tr>
      );
    });
    
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            <th>Count</th>
            <th>Price</th>
            <th>Item id</th>
            <th>Variation id</th>
          </tr>
        </thead>
        <tbody>
          {tableBody}
        </tbody>
      </Table>
    );
  }
  
  render() {
    
    let items = this.props.items;
    
    if (_.isEmpty(items)) {
      return null;
    }
    
    return (
      <GridSection title="Item information" className={styles.itemDetailSection}>
        {this._createItemDetailTable()}
      </GridSection>
    );
  }
}

ItemDetailSection.propTypes = {
  items: React.PropTypes.array
};

ItemDetailSection.defaultProps = {
  items: []
};
