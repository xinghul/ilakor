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
    
    return (
      <div>
        <p>My daughter made drawings with the pens you sent,
line drawings that suggest the things they represent,
different from any drawings she — at ten — had done,
closer to real art, implying what the mind fills in.
For her mother she made a flower fragile on its stem;
for me, a lion, calm, contained, but not a handsome one.
She drew a lion for me once before, on a get-well card,
and wrote I must be brave even when it’s hard.
        </p>
        <p>Such love is healing — as you know, my friend,
especially when it comes unbidden from our children
despite the flaws they see so vividly in us.
Who can love you as your child does?
Your son so ill, the brutal chemo, his looming loss
owning you now — yet you would be this generous
to think of my child. With the pens you sent
she has made I hope a healing instrument.
        </p>
      </div>
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
      <Route path="checkout" component={CheckoutApp} />
      <Route path="completeLocal" component={CompleteLocalApp} />
      <Route path="*" component={IndexApp} />
    </Route>
  </Router>
), document.getElementById("mainContent"));
