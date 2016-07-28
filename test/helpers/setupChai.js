"use strict";

import chai from "chai"
import chaiEnzyme from "chai-enzyme"

/**
 * Custom logger middleware.
 * Especially useful for formatting error message.
 */
function LoggerMiddleware(wrapper) {
  let html = wrapper.html();
  
  // do something with html here
  
  return html;
}

chai.use(chaiEnzyme(LoggerMiddleware));