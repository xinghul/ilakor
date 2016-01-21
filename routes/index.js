+function(undefined) {
"use strict";

var express = require("express");

var api    = require("./api")
,   auth   = require("./auth")
,   router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  if (req.user) {
    res.cookie("user", JSON.stringify(req.user.infoLocal));
  }
  
  res.render("index");
});

router.use("/api", api);

router.use("/auth", auth);

module.exports = router;

}();
