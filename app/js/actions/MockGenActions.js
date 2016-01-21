+function(undefined) {
  "use strict";

  var AppDispatcher    = require("../dispatcher/AppDispatcher")
  ,   MockGenConstants = require("../constants/MockGenConstants");

  // Define action methods
  var MockGenActions = {
    // Receive inital product data
    generateCsv: function() {
      AppDispatcher.handleAction({
        actionType: MockGenConstants.GENERATE_START
      });
    },
  };

  module.exports = MockGenActions;

}();
