+function() {
"use strict";

var express = require("express");

var router = express.Router()
,   food   = require("./api/food");

/********************************************************
 *                      Food Routes                     *
 ********************************************************/

router
  .all(function(req, res, next) {
    // runs for all HTTP verbs first
    next();
  })
  .route("/foods")
  .get(function(req, res, next) {
    
    food.getAll().then(function(foods) {
      res.status(200).json(foods);
    }).catch(function(err) {
      console.log(err);

      res.status(500).end("error occurred when trying to fetch the foods.");
    });

  })
  .post(function(req, res, next) {
    
    food.add(JSON.parse(req.body.food)).then(function(newFood) {
      res.status(200).json(newFood);
    }).catch(function(err) {
      console.log(err);

      res.status(500).end("error occurred when trying to add the food.");
    });
    
  });

module.exports = router;

}();
