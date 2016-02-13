+function(undefined) {
"use strict";

var express = require("express")
,   _       = require("underscore");

var api    = require("./api")
,   auth   = require("./auth")
,   router = express.Router();

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.redirect("/");
}

// router.get("*", function (req, res){
//   res.render("index");
// });

/* GET home page. */
router.get("/", function(req, res, next) {
  // store user into cookie from here
  if (req.user) {
    // XXX might need a better check here
    if (req.user.local.username) {
      // if it's local
      res.cookie("user", JSON.stringify(req.user.infoLocal));      
    } else if (req.user.facebook.id) {
      // if it's facebook
      res.cookie("user", JSON.stringify(req.user.infoFacebook));
    } else if (req.user.google.id) {
      // if it's google
      res.cookie("user", JSON.stringify(req.user.infoGoogle));
    } else if (req.user.twitter.id) {
      // if it's twitter
      res.cookie("user", JSON.stringify(req.user.infoTwitter));
    }
  }
  
  res.render("index");
});

router.get("/profile", ensureLoggedIn, function(req, res) {
  res.render("profile");
});

router.use("/api", api);

router.use("/auth", auth);

module.exports = router;

}();
