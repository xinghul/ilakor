"use strict";

import React from "react"
import { render } from "react-dom"
import { Router, Route, IndexRoute, Link, hashHistory } from "react-router"
import createBrowserHistory from 'history/lib/createBrowserHistory'

import ItemDisplayApp from "components/ItemDisplayApp.jsx"
import ItemManageApp from "components/ItemManageApp.jsx"
import AccountApp from "components/AccountApp.jsx"
import NavbarApp from "components/NavbarApp.jsx"
import SocialApp from "components/SocialApp.jsx"

class App extends React.Component {
    
  render() {
    return (
      <div>
        <NavbarApp />
        {this.props.children}
      </div>
    );
  }
}

const IndexApp = React.createClass({
  render() {
    return <h3>Index Route</h3>
  }
})

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={IndexApp} />
      <Route path="itemDisplay" component={ItemDisplayApp} />
      <Route path="itemManage" component={ItemManageApp} />
      <Route path="account" component={AccountApp} />
      <Route path="social" component={SocialApp} />
      <Route path="*" component={IndexApp} />
    </Route>
  </Router>
), document.getElementById("mainContent"));
