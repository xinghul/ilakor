"use strict";

let request = require("request");

let charge = {
  user: "572e73943881a37c26bda615",
  address: {
    name: "Levi Lu",
    phone: "4126141371",
    email: "xinghu1989@gmail.com",
    street: "322 Brighton Avenue",
    city: "San Francisco",
    state: "CA",
    zip: "94112"
  },
  charge: {
    amount: 800,
    currency: "usd",
    source: "String"
  },
  
  items: [
    "57190769b5e5032c2264ff56",
    "5719076ab5e5032c2264ff59",
    "5719076ab5e5032c2264ff5c"
  ],
};

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
  
  charge.charge.source = token.id;
  
  request.post({
    url: "http://localhost:3001/charge",
    form: {
      charge: JSON.stringify(charge)
    }
  }, function(err, response, body) {
    if (err) {
      console.log(err);
    } else {
      console.log(body);
    }
  });
});

