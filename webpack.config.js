"use strict";

let webpack = require("webpack"),
    path = require("path");

let APP_DIR = path.resolve(__dirname, "app/js/");

let config = {
  entry: APP_DIR + "/app.js",
  output: {
    path: APP_DIR,
    filename: "bundle.js"
  },
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  },
  resolve: {
    root: [
      path.resolve("app/js")
    ]
  },
  module : {
    loaders : [
      {
        test : /\.(js|jsx)$/,
        include : APP_DIR,
        loader : "babel"
      },
      {
        test: /\.css$/,
        loaders: [
          "style?sourceMap",
          "css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]"
        ]
      },
      {
        test: /\.json$/,
        loader: "json-loader" 
      }
    ]
  }
};

module.exports = config;