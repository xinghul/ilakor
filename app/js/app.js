"use strict";

import React from "react"
import { render } from "react-dom"
import { Router, Route, IndexRoute, Link, hashHistory } from "react-router"
import createBrowserHistory from 'history/lib/createBrowserHistory'

import ItemDisplayApp from "./components/ItemDisplayApp.jsx"
import NavbarApp from "./components/NavbarApp.jsx"

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

const About = React.createClass({
  render() {
    return <h3>Index Route</h3>
  }
})

class testApp extends React.Component {
  render() {
    return (
      <div>
        <h2>Test Route</h2>
      </div>
    );
  }
}

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={About} />
      <Route path="items" component={ItemDisplayApp} />
      <Route path="testRoute2" component={testApp} />
      <Route path="*" component={testApp} />
    </Route>
  </Router>
), document.getElementById("mainContent"));
