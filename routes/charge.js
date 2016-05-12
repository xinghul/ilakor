"use strict";

let express = require("express")
,   _       = require("underscore")
,   stripe  = require("stripe")("sk_test_jkhA0OtH2wJTqnQYt0hZAbLQ");

let router = express.Router();

let Charge = require("./charge/charge");

let CustomError = require("./utils/CustomError");


/********************************************************
 *                      Charge Routes                   *
 ********************************************************/
router.route("/")
/**
 * Global logic for path '/charge'.
 */
.all(function(req, res, next) {
  
  next();
})
/**
 */
.get(function(req, res, next) {
  
  

})
/**
 * Adds a new charge.
 */
.post(function(req, res, next) {
  
  let rawData;
  
  if (!req.body.charge) {
    return next(new CustomError(400, "charge info undefined."));
  }
  
  try {
    rawData = JSON.parse(req.body.charge);
  } catch (err) {
    console.log(err.stack);
    
    return next(new CustomError(400, "Malformed JSON."));
  }
  
  let charge = rawData.charge;
  
  stripe.charges.create({
    source: charge.source,
    amount: charge.amount,
    currency: charge.currency
  }).then(function(charge) {
    return Charge.add(rawData);
  }).then(function(newCharge) {
    res.status(200).json(newCharge);
  }).catch(function(err) {
    console.log(err.stack);
    
    // deal with error
    next(new CustomError(500, "Internal error."));
  });
})
/**
 * Updates a specific tag by id.
 */
.put(function(req, res, next) {
  
})
/**
 * Deletes a specific tag by id.
 */
.delete(function(req, res, next) {
  
});

module.exports = router;