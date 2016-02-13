+function() {
"use strict";

var express = require("express")
,   jwt     = require("jsonwebtoken")
,   _       = require("underscore");

var router = express.Router()
,   item   = require("./api/item");

var CustomError = require("./utils/CustomError");

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
 *                      Item Routes                     *
 ********************************************************/

router.route("/items")
  .all(function(req, res, next) {
    
    var itemId = req.query.id || req.params.id;
    
    if (_.isString(itemId)) {
      req.itemId = itemId;
    }
    
    next();
  })
  .get(function(req, res, next) {
    
    var itemId = req.itemId;
    
    if (_.isString(itemId)) {
      item.get(itemId).then(function(item) {
        res.status(200).json(item);
      }).catch(function(err) {
        console.log(err);
        
        next(new CustomError(500, "Internal error"));
      });
    } else {
      item.getAll().then(function(items) {
        res.status(200).json(items);
      }).catch(function(err) {
        console.log(err);
        
        next(new CustomError(500, "Internal error"));
      });
    }

  })
  .post(function(req, res, next) {
    
    var rawData;
    
    if (!req.body.item) {
      return next(new CustomError(400, "Item info undefined."));
    }
    
    try {
      rawData = JSON.parse(req.body.item);
    } catch (err) {
      console.log(err);
      
      return next(new CustomError(400, "Malformed JSON."));
    }

    item.add(rawData).then(function(newItem) {
      res.status(200).json(newItem);
    }).catch(function(err) {
      console.log(err);
      
      next(new CustomError(500, "Internal error."));
    });
    
  })
  .delete(function(req, res, next) {
    var itemId = req.itemId;
    
    if (_.isString(itemId)) {
      item.remove(itemId).then(function(item) {
        res.status(200).json(item);
      }).catch(function(err) {
        console.log(err);
        
        next(new CustomError(500, "Internal error."));
      });
    } else {
      next(new CustomError(400, "Item id not specified!"));
    }
  });

module.exports = router;

}();
