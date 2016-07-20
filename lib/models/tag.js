"use strict";

let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let TagSchema = new Schema({
  
  // name of the tag
  name: {
    type: String,
    lowercase: true,
    trim: true,
    required: true
  }

});

TagSchema.path("name").validate(function(name) {
  // numbers and special chars are not allowed
  let nameRegex = /^[a-zA-Z ]+$/;
  
  return nameRegex.test(name);
}, "The specified name is invalid.");

mongoose.model("Tag", TagSchema);
