"use strict";

let path  = require("path")
,   fs    = require("fs")
,   _     = require("lodash")
,   Mocha = require("mocha");

require("babel-register")();

// ignore all those styles we included in the components
require("ignore-styles");

// set up jsdom and chai
require("./helpers/setupJsdom");
require("./helpers/setupChai");

let args = require("./helpers/argv")(process.argv)
,   mocha = new Mocha({
      ui: "bdd",
      reporter: args.reporter,
      timeout: args.timeout
    });

args.tests.forEach((file) => {
  mocha.addFile(file);
});

console.log(`Running ${mocha.files.length} tests...`);

mocha.run((failures) => {
  process.on("exit", () => {
    process.exit(failures);
  });
});