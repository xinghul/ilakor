import _ from "lodash";

import React from "react";
import { Row, Col } from "react-bootstrap";

import SimpleTable from "lib/SimpleTable";

import AddTagForm from "./TagManageApp/AddTagForm";

import TagManageAction from "actions/item/TagManageAction";
import TagManageStore from "stores/item/TagManageStore";

import styles from "components/ManageApp/TagManageApp.scss";

/**
 * Gets the new state from subscribed stores.
 * 
 * @return {Object}
 */
function getStateFromStores() {
  return {
    tags: TagManageStore.getTags()
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
    
    this.state = {
      tags: TagManageStore.getTags()
    };
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    TagManageStore.addChangeListener(this._onChange);
    
    TagManageAction.getTags(true);
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    TagManageStore.removeChangeListener(this._onChange);
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
      <div className={styles.tagManageApp}>
        <Row>
          <Col xs={12} md={6}>
            <AddTagForm />
          </Col>
          <Col xs={12} md={6}>
            <SimpleTable 
              store={TagManageStore}
              data={this.state.tags} 
              title="Tags"
              removeHandler={TagManageAction.removeTag}
            />
          </Col>
        </Row>
      </div>
    );
    
  }
  
}
