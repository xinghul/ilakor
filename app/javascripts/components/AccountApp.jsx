"use strict"

import React from "react"
import _ from "lodash"
import invariant from "invariant"
import { hashHistory } from "react-router"

import AuthStore from "stores/AuthStore"

import styles from "components/AccountApp.scss"

/**
 * Gets the new state from subscribed stores.
 * 
 * @return {Object}
 */
function getStateFromStores() {
  return {
    user: AuthStore.getUser()
  };
}

export default class AccountApp extends React.Component {
  
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
    AuthStore.addChangeListener(this._onChange);
  }
  
  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    AuthStore.removeChangeListener(this._onChange);
  }
  
  /**
   * @private
   * Handler for when subscribed stores emit 'change' event.
   */
  _onChange = () => {
    this.setState(getStateFromStores());
  };
  
  /**
   * @inheritdoc
   */
  render() {
      
    return (
      <div>Hello</div>
    );
    
  }

}
