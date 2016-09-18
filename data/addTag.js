"use strict";

var request = require("request");

var tag = {
  name: "Cutting"
};

request.post({
  url: "http://localhost:8080/api/tags",
  form: {
    data: JSON.stringify(tag)
  }
}, function(err, response, body) {
  if (err) {
    console.log(err);
  } else {
    console.log(body);
  }
});