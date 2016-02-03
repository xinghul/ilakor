+function() {
"use strict";

var express = require("express")
,   jwt     = require("jsonwebtoken");

var router = express.Router()
,   food   = require("./api/food");

/********************************************************
 *                     Authentication                   *
 ********************************************************/
 // logged in is not needed to access the api
 router.use(function(req, res, next) {
   
   var token = req.body.token || req.query.token || req.headers["x-access-token"];
   
   if (token) {
     
     jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
       if (err) {
         
         return res.json({
           success: false, 
           message: "Failed to authenticate token."
         });
         
       } else {         
         next();
       }
     });
     
   } else {
     res.status(403).send({
       success: false,
       message: "No token provided."
     });
   }
 });
 

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
