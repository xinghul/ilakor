"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"
import { Table } from "react-bootstrap"

import GridSection from "lib/GridSection"

import styles from "components/ItemManageApp/ItemListTable.scss"

export default class ItemListTable extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);    
  }
  
  /**
   * @private
   * Renders the item list table.
   *
   * @return {JSX} the jsx created.
   */
  _renderItemListTable() {
    
    let items = this.props.items
    ,   tableBody = [];
    
    for (let item of items)
    {
      tableBody.push(
        <tr onClick={this.props.handleItemClick.bind(this, item)} key={item._id}>
          <td>{items.indexOf(item)}</td>
          <td>{item.name}</td>
          <td>{item.price}</td>
          <td>{item.tag.join(",")}</td>
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
            <th>Tag</th>
          </tr>
        </thead>
        <tbody>
          {tableBody}
        </tbody>
      </Table>
    );
  }
    
  /**
   * @inheritdoc
   */
  render() {
    let itemListTable = this._renderItemListTable();
    
    return (
      <GridSection title="Items" className={styles.itemListTable}>
        {itemListTable}
      </GridSection>
    )
  }
}

ItemListTable.propTypes = {
  items: React.PropTypes.array,
  handleItemClick: React.PropTypes.func
};

ItemListTable.defaultProps = {
  items: [],
  handleItemClick: function() {}
};
