import _ from "lodash"
import invariant from "invariant"
import { EventEmitter } from "events"

import AppDispatcher from "dispatcher/AppDispatcher"
import AppConstants from "constants/AppConstants"

const CHANGE_EVENT = "change";

const validRoutes = [
  "/", "/shop", "/manage", "/account", "/checkout", "/completeLocal"
];

let _route = "/";

let AppStore = _.extend({}, EventEmitter.prototype, {

  /**
   * Sets the route.
   * 
   * @param  {Object} route the new route value.
   */
  setRoute: function(route) {
    invariant(validRoutes.indexOf(route) !== -1, `Given route '${route}' is not valid.`);

    _route = route;
  },

  /**
   * Returns the route.
   * 
   * @return {String} 
   */
  getRoute: function() {
    return _route;
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
  subscribe: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * Unsubscribes a callback from the 'change' event.
   * 
   * @param  {Function} callback the callback to remove.
   */
  unsubscribe: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

AppStore.dispatchToken = AppDispatcher.register((payload) => {
  const { action } = payload;

  switch(action.actionType) {

    case AppConstants.ROUTE_CHANGE:
      AppStore.setRoute(action.route);
      AppStore.emitChange();
      break;

    default:
      // do nothing
  }

});

export default AppStore;