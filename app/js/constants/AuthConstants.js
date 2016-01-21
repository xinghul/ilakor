+function(undefined) {
  "use strict";

  var keyMirror = require("fbjs/lib/keyMirror");

  module.exports = keyMirror({
    TOGGLE_MODE: null,
    TOGGLE_MODAL: null,

    INPUT_USERNAME: null,
    INPUT_PASSWORD: null,
    INPUT_EMAIL: null,

    RECEIVED_USER: null
  });

}();
