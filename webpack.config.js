+function(undefined) {
"use strict";

var path = require("path");
console.log(path.resolve("./node_modules"));
module.exports = {
  entry: path.join(__dirname, "app/js/app.js"),
  output: {
    filename: path.join(__dirname, "app/js/bundle.js")
  },
  resolve: {
    root: [
      path.resolve("."),
      path.resolve("app/js")
    ]
  },
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  },
  module: {
    loaders: [
      // the 'transform-runtime' plugin tells babel to require the runtime 
      // instead of inlining it. 
      {
        test: /\.(jsx|js)?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
          plugins: ['transform-runtime']
        }
      },
      {
        test: /\.json$/,
        loader: "json-loader" 
      }
    ]
  }
}
}();