"use strict";

import _ from "lodash"
import invariant from "invariant"
import { EventEmitter } from "events"

import AppDispatcher from "dispatcher/AppDispatcher"
import AuthConstants from "constants/AuthConstants"

const CHANGE_EVENT = "change";

let _user = {}
,   _isModalOpen = false;

let AuthStore = _.extend({}, EventEmitter.prototype, {

  /**
   * Sets the user.
   * 
   * @param  {Object} user the new user value.
   */
  setUser: function(user) {
    invariant(_.isObject(user), `setUser(user) expects an object as 'user', but gets '${typeof user}'.`);
    
    _user = user;
  },

  /**
   * Returns the user.
   * @return {Object} 
   */
  getUser: function() {
    return _user;
  },
  
  /**
   * Sets the isModalOpen flag.
   * 
   * @param  {Boolean} isModalOpen the new value.
   */
  setIsModalOpen: function(isModalOpen) {
    invariant(_.isBoolean(isModalOpen), `setIsModalOpen(isModalOpen) expects a boolean as 'isModalOpen', but gets '${typeof isModalOpen}'.`);
    
    invariant(_isModalOpen !== isModalOpen, `setIsModalOpen(isModalOpen) can't be called with same value.`);

    _isModalOpen = isModalOpen;
  },
  
  /**
   * Returns the isModalOpen flag
   * 
   * @return {Boolean}
   */
  getIsModalOpen: function() {
    return _isModalOpen;
  },
  
  /**
   * Emits the 'change' event.
   */
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * Subscribes a callback to the 'change' event.
   * 
   * @param  {Function} callback the callback to add.
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
    
    // emit change right away
    // sometimes log in from cookie happens before the apps register to the AuthStore 
    // therefore they will not receive the 'change' events from logging in from cookie
    // and result in an empty user
    this.emitChange();
  },

  /**
   * Unsubscribes a callback from the 'change' event.
   * 
   * @param  {Function} callback the callback to remove.
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

AuthStore.dispatchToken = AppDispatcher.register(function(payload) {
  let action = payload.action;

  switch(action.actionType) {

    case AuthConstants.RECEIVED_USER:
      AuthStore.setUser(action.user);
      AuthStore.emitChange();
      break;
      
    case AuthConstants.SET_MODAL_OPEN:
      AuthStore.setIsModalOpen(action.isModalOpen);
      AuthStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default AuthStore;