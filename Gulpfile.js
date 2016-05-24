"use strict";

let gulp       = require("gulp")
,   sass       = require("gulp-sass")
,   gutil      = require("gulp-util")
,   nodemon    = require("gulp-nodemon")
,   source     = require("vinyl-source-stream")
,   buffer     = require("vinyl-buffer")
,   browserify = require("browserify")
,   watchify   = require("watchify")
,   babelify   = require("babelify")
,   envify     = require("envify")
,   lrload     = require("livereactload");


let isProd = process.env.NODE_ENV === "production"


function createBundler(useWatchify) {
  return browserify({
    entries:      ["./app/js/app.js"],
    paths:        ["./node_modules", "./app/js"],
    transform:    [ [babelify, {}], [envify, {}] ],
    plugin:       isProd || !useWatchify ? [] : [ lrload ],
    debug:        !isProd,
    cache:        {},
    packageCache: {},
    fullPaths:    !isProd 
  })
  // .plugin(require("css-modulesify"), {
  //   rootDir: __dirname,
  //   output: "./app/stylesheets/bundle.css"
  // });
}

gulp.task("bundle:js", function() {
  let bundler = createBundler(false);
  bundler
    .plugin(require("css-modulesify"), {
      rootDir: __dirname,
      output: "./app/stylesheets/bundle.css"
    })
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("app/js"))
})

gulp.task("watch:js", function() {
  // start JS file watching and rebundling with watchify
  let bundler = createBundler(true);
  
  let watcher = watchify(bundler);
  
  rebundle();
  
  return watcher
    .on("error", gutil.log)
    .on("update", rebundle);

  function rebundle() {
    gutil.log("Update JavaScript bundle")
    watcher
      .bundle()
      .on("error", gutil.log)
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(gulp.dest("app/js"));
  }
})

gulp.task("watch:server", function() {
  nodemon({ script: "nodemon.js", ext: "js", ignore: ["gulpfile.js", "bundle.js", "node_modules/*"] })
    .on("change", function () {})
    .on("restart", function () {
      console.log("Server restarted")
    })
})

gulp.task("sass", function() {
  return gulp.src("./build/sass/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./app/stylesheets/"));
})

gulp.task("watch", ["watch:server", "watch:js"])

gulp.task("default", ["bundle:js", "sass"], function() {
  console.log("Build succeeded.");
});

//=================

// 
// "use strict";
// 
// let gulp       = require("gulp")
// ,   jade       = require("gulp-jade")
// ,   sass       = require("gulp-sass")
// ,   watchify   = require("watchify")
// ,   del        = require("del")
// ,   browserify = require("browserify")
// ,   babelify   = require("babelify")
// ,   envify     = require("envify")
// ,   source     = require("vinyl-source-stream");
// 
// 
// gulp.task("default", ["browserify", "jade", "sass"], function() {
//   console.log("Build succeeded.");
// });
// 
// gulp.task("browserify", ["clean"], function() {
//   let bundler = browserify({
//       entries: ["./app/js/app.js"],
//       paths: ["./node_modules", "./app/js"],
//       cache: {},
//       packageCache: {},
//       poll: true,
//       keepAlive: true,
//       plugin: [watchify]
//     })
//     .transform(babelify)
//     .transform(envify)
//     .plugin(require("css-modulesify"), {
//       rootDir: __dirname,
//       output: "./app/stylesheets/bundle.css"
//     });
//     
//     bundler.on("update", bundle);
//     bundle();
// 
//     function bundle() {
//       console.log("Rebuilding");
//       
//       bundler.bundle()
//       .pipe(source("bundle.js"))
//       .pipe(gulp.dest("./app/js/"));
//       
//       console.log("done.");
//     }
// });
// 
// gulp.task("jade", ["clean"], function() {
//   return gulp.src("./build/jade/*.jade")
//     .pipe(jade({
//       pretty: true
//     }))
//     .pipe(gulp.dest("./app/views/"));
// });
// 
// gulp.task("sass", ["clean"], function() {
//   return gulp.src("./build/sass/*.scss")
//     .pipe(sass())
//     .pipe(gulp.dest("./app/stylesheets/"));
// });
// 
// gulp.task("clean", function(_callback) {
//   return del([
//       "./app/views/*",
//       "./app/stylesheets/main.css",
//       "./app/stylesheets/bundle.css",
//       "./app/bundle.js"
//     ], _callback);
// });