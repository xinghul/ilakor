import React from "react";
import _ from "lodash";
import invariant from "invariant";
import { Nav, NavItem } from "react-bootstrap";

import OrderHistorySection from "./AccountApp/OrderHistorySection";
import AccountDetailSection from "./AccountApp/AccountDetailSection";

import SidePanel from "lib/SidePanel";
import AlertMessage from "lib/AlertMessage";

import AuthStore from "stores/AuthStore";
import AuthAction from "actions/AuthAction";

import styles from "components/AccountApp.scss";

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

/**
 * @class
 * @extends {React.Component}
 */
export default class AccountApp extends React.Component {
  
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = {
      user: AuthStore.getUser(),
      
      selectedNav: 1
    };
  }
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    AuthStore.subscribe(this._onChange);
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    AuthStore.unsubscribe(this._onChange);
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
   * Handler for when NavItems are selected.
   * 
   * @param  {Number} selectedKey the selected NavItem key.
   */
  _onNavItemSelect = (selectedKey) => {
    this.setState({
      selectedNav: selectedKey
    });
  };
  
  /**
   * @private
   * Handler for when the login link is clicked.
   */
  _onLoginClick = () => {
    AuthAction.showModal();
  };
  
  /**
   * @private
   * Creates the jsx for the content when user is not logged in.
   * 
   * @return {JSX}
   */
  _createLoginAreaJsx() {
    return (
      <AlertMessage className={styles.loginMessage}>
        <a className={styles.loginLink} onClick={this._onLoginClick}>Log in</a> to view account page.
      </AlertMessage>
    );
  }
  
  /**
   * @private
   * Creates the jsx for side panel nav.
   * 
   * @return {JSX}
   */
  _createNavJsx() {
    return (
      <SidePanel position="fixed" align="top">
        <Nav bsStyle="pills" stacked activeKey={this.state.selectedNav} onSelect={this._onNavItemSelect}>
          <NavItem eventKey={1}>Account detail</NavItem>
          <NavItem eventKey={2}>Order history</NavItem>
        </Nav>
      </SidePanel>
    );
  }
  
  /**
   * @inheritdoc
   */
  render() {
    
    let mainContent = do {
      if (_.isEmpty(this.state.user)) {
        this._createLoginAreaJsx();
      } else if (this.state.selectedNav === 1) {
        <AccountDetailSection user={this.state.user} />;
      } else if (this.state.selectedNav === 2) {
        <OrderHistorySection user={this.state.user} />;
      }
    }
      
    return (
      <div className={styles.accountApp}>
        <div className={styles.navMenu}>
          {this._createNavJsx()}
        </div>
        <div className={styles.mainContent}>
          {mainContent}
        </div>
      </div>
    );
    
  }

}
