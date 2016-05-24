"use strict";

let gulp = require("gulp")
,   sass = require("gulp-sass")
,   nodemon = require("gulp-nodemon")
,   webpack = require("webpack-stream");

const webpackConfig = require("./webpack.config.js");

gulp.task("sass", function() {
  return gulp.src("./build/sass/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./app/stylesheets/"));
});

gulp.task("webpack", function() {
  return gulp
    .src("app/javascripts/app.js")
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest("app/javascripts"));
});

gulp.task("webpack:watch", function() {
  return gulp
    .src("app/javascripts/app.js")
    .pipe(webpack(Object.assign({watch: true}, webpackConfig)))
    .pipe(gulp.dest("app/javascripts"));
});

gulp.task("watch:server", function() {
  nodemon({ 
      script: "nodemon.js", 
      ext: "js", 
      ignore: ["gulpfile.js", "app/*", "test/*", "node_modules/*"] 
    })
    .on("change", function () {})
    .on("restart", function () {
      console.log("Server restarted");
    });
})

gulp.task("default", ["sass", "webpack"], function() {
  console.log("Build succeeded.");
});

gulp.task("watch", ["sass", "webpack:watch", "watch:server"], function() {
  console.log("Build succeeded.");
});