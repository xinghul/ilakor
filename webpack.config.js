"use strict";

let webpack = require("webpack")
,   path = require("path")
,   ExtractTextPlugin = require("extract-text-webpack-plugin");

const APP_DIR = path.resolve(__dirname, "app/javascripts/");

let config = {
  entry: ["babel-polyfill", APP_DIR + "/app.jsx"],
  output: {
    path: APP_DIR,
    filename: "bundle.js"
  },
  resolve: {
    root: [
      path.resolve("app/javascripts"),
      path.resolve("app/stylesheets")
    ],
    extensions: ["", ".js", ".jsx"]
  },
  stats: { children: false },
  module: {
    noParse: /node_modules\/json-schema\/lib\/validate\.js/,
    loaders : [
      {
        exclude: /node_modules/,
        loader: "babel"
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader!postcss-loader")
      },
      {
        test: /.css$/,
        include: /node_modules/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      {
        test: /\.css$/, 
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader")
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
  },
  postcss: function () {
    return [require("postcss-input-range"), require("postcss-sorting"), require("autoprefixer")];
  },
  plugins: [
    new ExtractTextPlugin("../stylesheets/bundle.css", { allChunks: true })
  ]
};

module.exports = config;