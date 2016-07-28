"use strict";

import fs from "fs"
import path from "path"
import program from "commander"
import _ from "lodash"

const TEST_DIR = path.join(process.cwd(), "app/javascripts")
,     TEST_EXTENSION = "spec.js";

/**
 * Ensures we have the correct args before passing back.
 * 
 * @param  {Object} program the commander object.
 * 
 * @return {Object} 
 */
function ensureArgs(program) {
  
  // TODO: add option for specifying which test/tests to run.
  let result = {
    timeout: _.toInteger(program.timeout),
    reporter: program.reporter,
    tests: getFileList(TEST_DIR).filter((file) => {
      return _.endsWith(file, TEST_EXTENSION);
    })
  };
  
  /**
   * Lists all files in a dir recursively.
   * 
   * @param  {String} dir the current listing dir.
   * @param  {String[]} filelist files listed so far.
   * 
   * @return {String[]}
   */
  function getFileList(dir, filelist) {
    filelist = filelist || [];

    let files = fs.readdirSync(dir);
        
    files.forEach((file) => {
      if (fs.statSync(dir + '/' + file).isDirectory()) {
        filelist = getFileList(dir + '/' + file, filelist);
      } else {
        filelist.push(path.resolve(dir, file));
      }
    });
    
    return filelist;
  };
  
  return result;
}

program
  .version("1.0.0")
  .usage(" -- [options]")
  .option("-t, --timeout <timeout>", "Specify the timeout for each test, default: '10000'", "10000")
  .option("-r, --reporter <reporter>", "Specify the reporter, default: 'spec'", "spec");

program.on("--help", () => {
  console.log("  Examples:");
  console.log("");
  console.log("    $ npm test -- -r spec -t 999");
  console.log("");
});

module.exports = (argv) => {
  program.parse(argv);
  
  return ensureArgs(program);
};