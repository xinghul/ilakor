+function(undefined) {
  "use strict";

  var gulp       = require("gulp")
  ,   jade       = require("gulp-jade")
  ,   sass       = require("gulp-sass")
  ,   del        = require("del")
  ,   browserify = require("browserify")
  ,   source     = require("vinyl-source-stream");

  // var jest = require('gulp-jest');
  //
  // gulp.task('jest', function() {
  //   return gulp.src('__tests__').pipe(jest({
  //     unmockedModulePathPatterns: [
  //           "node_modules/react"
  //       ],
  //       testDirectoryName: "app/js/stores",
  //       testPathIgnorePatterns: [
  //           "node_modules"
  //       ],
  //       moduleFileExtensions: [
  //           "js",
  //           "json",
  //           "react"
  //       ]
  //   }));
  // });

  gulp.task("default", ["browserify", "jade", "sass"], function() {
    console.log("Build succeeded.");
  });

  gulp.task("browserify", ["clean"], function() {
    return browserify({
        entries: ["./app/js/app.js"],
        paths: ["./node_modules", "./app/js"]
      })
      .plugin(require("css-modulesify"), {
        rootDir: __dirname,
        output: "./app/stylesheets/bundle.css"
      })
      .bundle()
      .pipe(source("bundle.js"))
      .pipe(gulp.dest("./app/js/"));
  })

  gulp.task("jade", ["clean"], function() {
    return gulp.src("./build/jade/*.jade")
      .pipe(jade({
        pretty: true
      }))
      .pipe(gulp.dest("./app/views/"));
  });

  gulp.task("sass", ["clean"], function() {
    return gulp.src("./build/sass/*.scss")
      .pipe(sass())
      .pipe(gulp.dest("./app/stylesheets/"));
  });

  gulp.task("clean", function(_callback) {
    return del([
        "./app/views/*",
        "./app/stylesheets/main.css",
        "./app/stylesheets/bundle.css",
        "./app/bundle.js"
      ], _callback);
  });

}();
