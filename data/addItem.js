"use strict";

var request = require("request");

var item = {
  name: "Table",
  tag: ["table"],
  image: ["test.png"],
  weight: 100,
  dimension: {
    length: 11,
    width: 12,
    height: 13
  }
};

request.post({
  url: "https://localhost:3001/api/items",
  form: {
    item: JSON.stringify(item)
  }
}, function(err, response, body) {
  if (err) {
    console.log(err);
  } else {
    console.log(body);
  }
});