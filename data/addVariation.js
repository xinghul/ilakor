"use strict";

var request = require("request");

var variation = {
  item: "57e07cdfdd76fb35bda656a2",
  info: {
    size: '2lb',
    taste: 'watermelon'
  },
  price: 27,
  outOfStock: false
};

request.post({
  url: "http://localhost:8080/api/variations",
  form: {
    data: JSON.stringify(variation)
  }
}, function(err, response, body) {
  if (err) {
    console.log(err);
  } else {
    console.log(body);
  }
});