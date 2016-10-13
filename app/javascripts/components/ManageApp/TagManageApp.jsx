import _ from "lodash";

import React from "react";
import { Row, Col } from "react-bootstrap";

import DataTable from "lib/DataTable";

import AddTagForm from "./TagManageApp/AddTagForm";

import TagManageAction from "actions/item/TagManageAction";
import TagManageStore from "stores/item/TagManageStore";

import styles from "components/ManageApp/TagManageApp.scss";

// tags table key to header
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
    tags: TagManageStore.getTags(),
    isLoading: TagManageStore.getIsLoading()
  };
}

/**
 * @class
 * @extends {React.Component}
 */
export default class TagManageApp extends React.Component {
  
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
    TagManageStore.subscribe(this._onChange);
    
    TagManageAction.getTags(true);
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    TagManageStore.unsubscribe(this._onChange);
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
    
    const { tags, isLoading } = this.state;

    return (
      <div className={styles.tagManageApp}>
        <Row>
          <Col xs={12} md={6}>
            <AddTagForm />
          </Col>
          <Col xs={12} md={6}>
            <DataTable
              data={tags} 
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
