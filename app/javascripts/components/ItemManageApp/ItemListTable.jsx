"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"

import { Table } from "react-bootstrap"

import styles from "components/ItemManageApp/ItemListTable.scss"

export default class ItemListTable extends React.Component {
  
  constructor(props) {
    super(props);    
  }
  
  componentDidMount() {
  }
  
  
  render() {
    let items = this.props.items
    ,   item
    ,   tableBody = [];
    
    for (let index = 0; index < items.length; index++)
    {
      item = items[index];
      
      tableBody.push(
        <tr onClick={this.props.handleItemClick.bind(this, item)} key={item._id}>
          <td>{index}</td>
          <td>{item.name}</td>
          <td>{item.price.base}</td>
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
}

ItemListTable.propTypes = {
  items: React.PropTypes.array,
  handleItemClick: React.PropTypes.func
};

ItemListTable.defaultProps = {
  items: [],
  handleItemClick: function() {}
};
