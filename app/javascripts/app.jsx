"use strict";

// import this first for overwrite reason
import bootstrapStyles from "bootstrap/dist/css/bootstrap.min.css"

import React from "react"
import { render } from "react-dom"
import ReactCSSTransitionGroup from "react-addons-css-transition-group"
import { Router, Route, IndexRoute, Link, hashHistory } from "react-router"
import { Form, FormGroup, FormControl, ControlLabel } from "react-bootstrap"

import ItemDisplayApp from "components/ItemDisplayApp"
import ItemManageApp from "components/ItemManageApp"
import AccountApp from "components/AccountApp"
import NavbarApp from "components/NavbarApp"
import SocialApp from "components/SocialApp"
import CheckoutApp from "components/CheckoutApp"

import DimensionRangeInput from "components/ItemManageApp/DimensionRangeInput"

class App extends React.Component {
    
  render() {
    return (
      <div>
        <NavbarApp />
        <ReactCSSTransitionGroup
          component="div"
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
    
    return (
      <DimensionRangeInput />
    );
  }
};

Stripe.setPublishableKey("pk_test_Yc07ytarKkLiL7yn1swr8mCP");

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={IndexApp} />
      <Route path="itemDisplay" component={ItemDisplayApp} />
      <Route path="itemManage" component={ItemManageApp} />
      <Route path="account" component={AccountApp} />
      <Route path="social" component={SocialApp} />
      <Route path="checkout" component={CheckoutApp} />
      <Route path="*" component={IndexApp} />
    </Route>
  </Router>
), document.getElementById("mainContent"));
