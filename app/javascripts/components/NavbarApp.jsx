import React from "react";
import { Navbar, Nav, NavItem, Image } from "react-bootstrap";
import { DropdownButton, MenuItem } from "react-bootstrap";


import styles from "components/NavbarApp.scss";

import GhostButton from "lib/GhostButton";

import AuthStore from "stores/AuthStore";
import AuthAction from "actions/AuthAction";

import ShoppingCartApp from "./ShoppingCartApp";

/**
 * @private
 *
 * Get new state from subscribed stores.
 *
 * @return {Object} the new state.
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
export default class NarbarApp extends React.Component {
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);

    this.state = {
      user: AuthStore.getUser()
    };
  }

  /**
   * @inheritdoc
   */
  componentDidMount() {
    AuthStore.subscribe(this._onChange);

    AuthAction.logInFromCookie();
  }

  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    AuthStore.unsubscribe(this._onChange);
  }

  /**
   * @private
   *
   * Handler for when subscribed stores emit 'change' event.
   */
  _onChange = () => {
    this.setState(getStateFromStores());
  };

  /**
   * @private
   *
   * Handler for logging out.
   */
  _onLogout = () => {
    AuthAction.logOut();
  };

  /**
   * @private
   *
   * Shows the auth modal.
   */
  _showModal = () => {
    AuthAction.showModal();
  };

  /**
   * Renders the auth button/label area in navbar.
   *
   * @return {JSX} the jsx created.
   */
  renderAuthArea() {

    const { user } = this.state;

    if (user && user._id) {

      let title = "Hello, " + user.username;

      return (
        <DropdownButton title={title} id="authDropdown">
          <MenuItem href="#/account">My Account</MenuItem>
          {user.isAdmin ? <MenuItem href="#/manage">Manage</MenuItem> : null}
          <MenuItem divider />
          <MenuItem onSelect={this._onLogout}>Log out</MenuItem>
        </DropdownButton>
      );

    } else {

    return (
        <div>
          <GhostButton onClick={this._showModal}>Sign in</GhostButton>
        </div>
      );

    }
  }

  /**
   * Returns the JSX for the NavbarApp.
   *
   * fluid: the navbar takes up the whole width of the document.
   * inverse: background color black and font color white.
   * fixedTop: position fixed top.
   *
   *
   * @return {JSX} the JSX created.
   */
  render() {

    return (
      <Navbar fluid inverse fixedTop className={styles.navbarApp}>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">
              <Image className={styles.brandImg} alt="iLakor" src="/images/logo.png" />
            </a>
          </Navbar.Brand>
          <Navbar.Toggle className={styles.toggle} />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem href="#/shop">
              Shop
            </NavItem>
          </Nav>
          <Nav pullRight className={styles.authArea}>
            {this.renderAuthArea()}
          </Nav>
          <Nav pullRight>
            <ShoppingCartApp />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );

  }

}
