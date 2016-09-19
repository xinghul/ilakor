"use strict";

import "babel-polyfill";

// import this first for overwrite reason
import bootstrapStyles from "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import { render } from "react-dom";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Router, Route, IndexRoute, Link, hashHistory } from "react-router";

import NavbarApp from "components/NavbarApp";
import AuthApp from "components/AuthApp";

import ItemDisplayApp from "components/ItemDisplayApp";
import ManageApp from "components/ManageApp";
import AccountApp from "components/AccountApp";
import SocialApp from "components/SocialApp";
import CheckoutApp from "components/CheckoutApp";
import CompleteLocalApp from "components/CompleteLocalApp";

import SidePanel from "lib/SidePanel";

import styles from "main/app.scss";

class App extends React.Component {
    
  render() {
    return (
      <div className={styles.app}>
        <NavbarApp />
        <AuthApp />
        <ReactCSSTransitionGroup
          component="div"
          className={styles.appContent}
          transitionName="route"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {React.cloneElement(this.props.children, {
            key: this.props.location.pathname
          })}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

class IndexApp extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    let style = {
      display: "flex",
      flexDirection: "row",
      height: "100%"
    };
    
    let contentStyle = {
      height: "100%",
      flex: "1",
      backgroundColor: "grey"
    };
    
    return (
      null
    );
  }
};

Stripe.setPublishableKey("pk_test_8mZpKZytd30HOivscwbQk51Z");

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={IndexApp} />
      <Route path="itemDisplay" component={ItemDisplayApp} />
      <Route path="manage" component={ManageApp} />
      <Route path="account" component={AccountApp} />
      <Route path="social" component={SocialApp} />
      <Route path="checkout" component={CheckoutApp} />
      <Route path="completeLocal" component={CompleteLocalApp} />
      <Route path="*" component={IndexApp} />
    </Route>
  </Router>
), document.getElementById("mainContent"));
