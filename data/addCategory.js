"use strict";

var request = require("request");

var category = {
  name: "Creatine"
};

request.post({
  url: "http://localhost:8080/api/categories",
  form: {
    data: JSON.stringify(category)
  }
}, function(err, response, body) {
  if (err) {
    console.log(err);
  } else {
    console.log(body);
  }
});