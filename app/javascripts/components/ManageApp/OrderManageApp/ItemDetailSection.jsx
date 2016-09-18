"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import { Table } from "react-bootstrap"

import GridSection from "lib/GridSection"
import BaseInfo from "lib/BaseInfo"

import styles from "components/ManageApp/OrderManageApp/ItemDetailSection.scss"

export default class ItemDetailSection extends React.Component {
  
  constructor(props) {
    super(props);    
  }
  
  createItemsTable() {
    let items = this.props.items
    ,   tableBody = [];
    
    for (let item of items)
    {
      tableBody.push(
        <tr key={item._id}>
          <td>{items.indexOf(item)}</td>
          <td>{item.name}</td>
          <td>{item.price}</td>
          <td>{item._id}</td>
        </tr>
      );
    }
    
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Id</th>
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
    
    let itemsTable = this.createItemsTable();
    
    return (
      <GridSection title="Item information" className={styles.itemDetailSection}>
        {itemsTable}
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
