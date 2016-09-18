import React from "react";
import _ from "lodash";
import invariant from "invariant";
import { Row, Col, Tab, Nav, NavItem, NavDropdown, MenuItem } from "react-bootstrap";

import OrderManageApp from "./ManageApp/OrderManageApp";
import BrandManageApp from "./ManageApp/BrandManageApp";
import CategoryManageApp from "./ManageApp/CategoryManageApp";
import TagManageApp from "./ManageApp/TagManageApp";

import styles from "components/ManageApp.scss"

/**
 * Gets the new state from subscribed stores.
 * 
 * @return {Object}
 */
function getStateFromStores() {
  return {
    user: AuthStore.getUser()
  };
}

export default class ManageApp extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
  }
  
  /**
   * @inheritdoc
   */
  render() {
      
    return (
      <Tab.Container id="manageAppContainer" defaultActiveKey="1">
        <Row className="clearfix">
          <Col md={12} sm={12}>
            <Nav bsStyle="tabs">
              <NavItem eventKey="1">
                Orders
              </NavItem>
              <NavDropdown eventKey="2" title="Items">
                <MenuItem eventKey="2.1">Manage items</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey="2.2">Manage brands</MenuItem>
                <MenuItem eventKey="2.3">Manage categories</MenuItem>
                <MenuItem eventKey="2.4">Manage tags</MenuItem>
              </NavDropdown>
            </Nav>
          </Col>
          <Col md={12} sm={12}>
            <Tab.Content animation>
              <Tab.Pane eventKey="1">
                <OrderManageApp />
              </Tab.Pane>
              <Tab.Pane eventKey="2.1">
                manage items
              </Tab.Pane>
              <Tab.Pane eventKey="2.2">
                <BrandManageApp />
              </Tab.Pane>
              <Tab.Pane eventKey="2.3">
                <CategoryManageApp />
              </Tab.Pane>
              <Tab.Pane eventKey="2.4">
                <TagManageApp />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    );
    
  }

}
