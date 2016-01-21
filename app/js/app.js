import React from "react"
import { render } from "react-dom"
import { Router, Route, Link, browserHistory } from "react-router"

+function(window, document, undefined) {
"use strict";

var ProductData = require("./ProductData")
,   CartAPI     = require("./utils/CartAPI")
,   CartApp     = require("./components/CartApp.react");

const NavbarApp  = require("./components/NavbarApp.react")
,     MockGenApp = require("./components/MockGenApp.react");

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

class HelloApp extends React.Component {
  render() {
    return (
      <div>
        <h2>Hello!</h2>
      </div>
    );
  }
}

class HiApp extends React.Component {
  render() {
    return (
      <div>
        <h2>Hi!</h2>
      </div>
    );
  }
}

localStorage.clear();

// for CartApp
ProductData.init();
CartAPI.getProductData();

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="testRoute1" component={HelloApp}/>
      <Route path="testRoute2" component={HiApp}/>
      <Route path="*" component={HelloApp}/>
    </Route>
  </Router>
), document.getElementById("mainContent"));

}(window, document);
