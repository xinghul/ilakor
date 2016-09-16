"use strict";

var request = require("request");

var brand = {
  name: "Garden of Life"
};

request.post({
  url: "http://localhost:8080/api/brands",
  form: {
    data: JSON.stringify(brand)
  }
}, function(err, response, body) {
  if (err) {
    console.log(err);
  } else {
    console.log(body);
  }
});