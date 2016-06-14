"use strict";

let express = require("express")
,   _       = require("lodash")
,   path    = require("path")
,   fs      = require("fs")
,   multer  = require("multer");

let api     = require("./api")
,   auth    = require("./auth")
,   charge  = require("./charge")
,   router  = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  // store user into cookie from here
  if (req.user) {
    res.cookie("user", JSON.stringify(req.user));
  }
  
  res.render("index");
});

router.use("/api", api);

router.use("/auth", auth);

router.use("/charge", charge);

let storage = multer.diskStorage({
  destination: path.resolve(__dirname, "tmp/uploads"),
  filename: function(req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

let upload = multer({ storage: storage });

router.route("/upload")
.all(function(req, res, next) {
  next();
})
.post(upload.any(), function(req, res, next) {
  return res.status(200).json({filename: req.files[0].filename});
})
.delete(function(req, res, next) {
  let filename = req.query.filename;
  
  fs.unlink(path.join(__dirname, "tmp/uploads", filename), function(err, response) {
    if (err) {
      return res.status(400).json(err);
    } else {
      return res.status(200).json(response);
    }
  });
});

module.exports = router;