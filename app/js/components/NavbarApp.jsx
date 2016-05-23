"use strict"

import React from "react"
import { Navbar, Nav, NavItem } from "react-bootstrap"

import styles from "./NavbarApp.css"

import AuthApp from "./AuthApp.jsx"
import ShoppingCartApp from "./ShoppingCartApp.jsx"

export default class NarbarApp extends React.Component {
  
  constructor(props) {
    super(props);
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
      <Navbar fluid inverse fixedTop className="navbarApp">
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#">Cramford</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem href="#/itemDisplay">
            Furnitures
          </NavItem>
          <NavItem href="#/itemManage">
            CMS
          </NavItem>
        </Nav>
        <Nav pullRight id="authModalTrigger">
          <AuthApp />
        </Nav>
        <Nav pullRight>
          <ShoppingCartApp />
        </Nav>
      </Navbar>
    );
    
  }

}
