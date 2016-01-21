+function(undefined) {
  "use strict";

  var _            = require("underscore")
  ,   EventEmitter = require("events").EventEmitter
  ,   Promise      = require("bluebird")
  ,   request      = Promise.promisify(require("request"));

  var mockDate = require("mock-data").date();

  var AppDispatcher    = require("../dispatcher/AppDispatcher")
  ,   MockGenConstants = require("../constants/MockGenConstants");


  // Define initial data points
  var CHANGE_EVENT = "change"
  ,   _data        = {};

  function generateCsv() {

    return Promise
      .cast()
      .then(function() {
        _data = {
          name: mockDate.generate()
        };

        Promise.resolve();
      });
  }

  // Extend ProductStore with EventEmitter to add eventing capabilities
  var MockGenStore = _.extend({}, EventEmitter.prototype, {

    // Return Test List
    getCsvData: function() {
      return _data;
    },

    // Emit Change event
    emitChange: function() {
      this.emit(CHANGE_EVENT);
    },

    // Add change listener
    addChangeListener: function(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    // Remove change listener
    removeChangeListener: function(callback) {
      this.removeListener(CHANGE_EVENT, callback);
    }

  });

  // Register callback with AppDispatcher
  AppDispatcher.register(function(payload) {
    var action = payload.action;
    var text;

    switch(action.actionType) {

      case MockGenConstants.GENERATE_START:
        generateCsv().done(function() {
          MockGenStore.emitChange();
        });
        break;

      default:
        return true;
    }

    return true;
  });

  module.exports = MockGenStore;

}();
