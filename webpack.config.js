"use strict";

let webpack = require("webpack")
,   path = require("path");

const APP_DIR = path.resolve(__dirname, "app/js/");

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
      path.resolve("app/js"),
      path.resolve("app/stylesheets")
    ],
    extensions: ["", ".js", ".jsx"]
  },
  module: {
    noParse: /node_modules\/json-schema\/lib\/validate\.js/,
    loaders : [
      {
        exclude: /node_modules/,
        loader: "babel"
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]", "sass"]
      },
      {
        test: /\.css$/, 
        loader: "style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]" 
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        loader: 'url-loader?limit=1000000'
      },
      {
        test: /\.json$/,
        loader: "json-loader" 
      }
    ]
  }
};

module.exports = config;