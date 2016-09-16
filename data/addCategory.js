"use strict";

var request = require("request");

var category = {
  name: "Post Workout"
};

request.post({
  url: "http://localhost:8080/api/categories",
  form: {
    category: JSON.stringify(category)
  }
}, function(err, response, body) {
  if (err) {
    console.log(err);
  } else {
    console.log(body);
  }
});