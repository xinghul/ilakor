"use strict";

let stripe = require("stripe")("sk_test_jkhA0OtH2wJTqnQYt0hZAbLQ");

stripe.tokens.create({
    card: {
      number: "4242424242424242",
      exp_month: 12,
      exp_year: 2018,
      cvc: "563"
    }
}, function(status, token) {
  console.log(token);
  
  return stripe.charges.create({
    source: token.id,
    amount: 1600,
    currency: 'usd'
  });
}).then(function(charge) {
  console.log(charge);
  // New charge created on a new customer 
}).catch(function(err) {
  console.log(err);
  // Deal with an error 
});