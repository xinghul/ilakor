import "babel-polyfill";

// import this first for overwrite reason
import bootstrapStyles from "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import { render } from "react-dom";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Router, Route, IndexRoute, Link, hashHistory } from "react-router";

import NavbarApp from "components/NavbarApp";
import AuthApp from "components/AuthApp";

import AuthStore from "stores/AuthStore";
import AppStore from "stores/AppStore";

import AppAction from "actions/AppAction";
import ItemManageAction from "actions/item/ItemManageAction";
import BrandManageAction from "actions/item/BrandManageAction";
import CategoryManageAction from "actions/item/CategoryManageAction";
import TagManageAction from "actions/item/TagManageAction";
import VariationManageAction from "actions/item/VariationManageAction";

import ItemDisplayApp from "components/ItemDisplayApp";
import ManageApp from "components/ManageApp";
import AccountApp from "components/AccountApp";
import CheckoutApp from "components/CheckoutApp";
import CompleteLocalApp from "components/CompleteLocalApp";

import SubmitButton from "lib/SubmitButton";

import styles from "main/app.scss";

const protectedRoutes = [
  "/manage", "/account", "/checkout"
];

const routeToBackgroundImage = {
  "/": "bg1", 
  "/shop": "bg2", 
  "/manage": "bg3",
  "/account": "bg4", 
  "/checkout": "bg1", 
  "/completeLocal": "bg2"
};

/**
* @private 
* onEnter hook ensures that the current user is admin.
*/
function ensureIsAdmin(nextState, replace) {

  const user = AuthStore.getUser();

  if (_.isEmpty(user) || !user.isAdmin) {
    replace({
      pathname: '/'
    });
  }
}

/**
* @private 
* onEnter hook ensures that the current customer is logged in.
*/
function ensureLoggedIn(nextState, replace) {

  const user = AuthStore.getUser();

  if (_.isEmpty(user)) {
    replace({
      pathname: '/'
    });
  }
}

/**
 * @private
 * Handler for when Router's onUpdate event.
 */
function onRouterUpdate() {
  const { pathname } = this.state.location;
  
  AppAction.updateRoute(pathname);
}

/**
 * Gets the new state from subscribed stores.
 * 
 * @return {Object}
 */
function getStateFromStores() {
  return {
    route: AppStore.getRoute()
  };
}
 
/**
 * @class
 * @extends {React.Component}
 */
class App extends React.Component {
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);
    
    this.state = getStateFromStores();
  }
  
  
  /**
   * @inheritdoc
   */
  componentDidMount() {
    AppStore.subscribe(this._onChange); 
    AuthStore.subscribe(this._onAuthChange);
    
    ItemManageAction.getItems();
    
    BrandManageAction.getBrands();
    
    CategoryManageAction.getCategories();
    
    TagManageAction.getTags();
    
    VariationManageAction.getVariations();
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    AppStore.unsubscribe(this._onChange);
    AuthStore.unsubscribe(this._onAuthChange);
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
   * Handler for when the auth store changes.
   */
  _onAuthChange = () => {
    const user = AuthStore.getUser();
    const { pathname } = this.props.location;
    
    if (_.isEmpty(user) && protectedRoutes.indexOf(pathname) !== -1) {
      hashHistory.push('/');
    }
  };

  /**
   * @inheritdoc
   */
  render() {
    
    const { route } = this.state;
    let imageSrc = routeToBackgroundImage[route];

    let backgroundStyle = {
      // backgroundImage: `url(/images/${imageSrc}.jpg)`
    };

    return (
      <div className={styles.app}>
        <NavbarApp />
        <AuthApp />
        <ReactCSSTransitionGroup
          component="div"
          className={styles.content}
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
    
    this.state = {
      isSubmitting: false
    };
  }
  
  _handleSubmit = () => {
    this.setState({
      isSubmitting: true
    });
  };
  
  render() {
    
    return (
      <div>
        <SubmitButton
          theme="black"
          handleSubmit={this._handleSubmit}
          isSubmitting={this.state.isSubmitting}
          submittingText="submitting"
          block
        >Submit</SubmitButton>
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
        
      </div>
    );
  }
};

Stripe.setPublishableKey("pk_test_8mZpKZytd30HOivscwbQk51Z");

render((
  <Router history={hashHistory} onUpdate={onRouterUpdate}>
    <Route path="/" component={App}>
      <IndexRoute component={IndexApp} />
      <Route path="shop" component={ItemDisplayApp} />
      <Route path="manage" component={ManageApp} onEnter={ensureIsAdmin} />
      <Route path="account" component={AccountApp} onEnter={ensureLoggedIn} />
      <Route path="checkout" component={CheckoutApp} onEnter={ensureLoggedIn} />
      <Route path="completeLocal" component={CompleteLocalApp} />
      <Route path="*" component={IndexApp} />
    </Route>
  </Router>
), document.getElementById("mainContent"));
