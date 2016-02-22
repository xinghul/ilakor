"use strict";

var request = require("request");

var tag = {
  name: "Chair Table"
};

request.post({
  url: "http://localhost:3001/api/tags",
  form: {
    tag: JSON.stringify(tag)
  }
}, function(err, response, body) {
  if (err) {
    console.log(err);
  } else {
    console.log(body);
  }
});

// request.put({
//   url: "http://localhost:3001/api/tags",
//   qs: {
//     id: "56cb900598fa6fe4a888d931"
//   },
//   form: {
//     tag: JSON.stringify(tag)
//   }
// }, function(err, response, body) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(body);
//   }
// });