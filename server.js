"use strict";

/**********************************************************
*                      Load Modules                      *
**********************************************************/
// load env letiables first
require("dotenv").load();

let express  = require("express")
,   path     = require("path")
,   fs       = require("fs")
,   os       = require("os")
,   session  = require("express-session")
,   passport = require("passport");

let favicon      = require("serve-favicon")
,   logger       = require("morgan")
,   cookieParser = require("cookie-parser")
,   bodyParser   = require("body-parser");

let app        = express()
,   MongoStore = require("connect-mongo")(session);

// set server root for future use
global.serverRoot = path.resolve(__dirname);

// set port for http and https
app.set("http_port", process.env.PORT || "8080");
app.set("https_port", process.env.HTTPS_PORT || "3002");

/**********************************************************
* Connect MongoDB, Bootstrap models and Config passport  *
**********************************************************/

let mongodbUrl = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/cramford";
require("mongoose").connect(mongodbUrl, function (err) {
  if (err) {
    console.log(err, err.stack);
  } else {
    console.log("Connected to mongodb.");
  }
});

let modelsPath = path.join(__dirname, "lib/models");
fs.readdirSync(modelsPath).forEach(function(file) {
  require(modelsPath + "/" + file);
});

/**********************************************************
*                     Configuration                      *
**********************************************************/
app.set("views", path.join(__dirname, "app/views"));
// app.engine("html", require("ejs").renderFile);
app.set("view engine", "pug");

app.use(favicon(__dirname + "/app/favicon.ico"));
// app.enable("trust proxy");
app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: "Levi Lu_Cramford",
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: mongodbUrl,
    db : "cramford",
    collection: "sessions"
  })
}));

// configure the passport settings.
require("./routes/config/passport").configure(app);

app.use(express.static(path.join(__dirname, "app")));

/**********************************************************
*                         Routes                         *
**********************************************************/
// app.use(function(req, res, next) {
//     res.setHeader('Last-Modified', (new Date()).toUTCString());
//     next();
// });
// 
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var forceSsl = function (req, res, next) {
  // if (app.get("env") === "production" && !req.secure) {
  //   return res.redirect("https://localhost:3002/");
  // }
  // 
  return next();
};

app.use(forceSsl);


let routes = require("./routes/index");
app.use("/", routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    
    // send back the json for now
    // because we're not using jade as view engine
    // so render with letiable injection does not work
    res.json(err);
    
    // res.render("error", {
    //   message: err.message,
    //   error: err
    // });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {}
  });
});

//exports for future use
module.exports = app;
