"use strict";

import React from "react"
import { render } from "react-dom"
import { Router, Route, Link, browserHistory } from "react-router"

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
    return <h3>About</h3>
  }
})

class HiApp extends React.Component {
  render() {
    return (
      <div>
        <h2>Hi!</h2>
      </div>
    );
  }
}

render((
  <Router>
    <Route path="/" component={App}>
      <Route path="testRoute1" component={ItemDisplayApp} />
      <Route path="testRoute2" component={HiApp} />
      <Route path="*" component={HiApp} />
    </Route>
  </Router>
), document.getElementById("mainContent"));
