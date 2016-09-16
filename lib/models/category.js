"use strict";

let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let CategorySchema = new Schema({
  
  // name of the category
  name: {
    type: String,
    lowercase: true,
    trim: true,
    required: true
  }

});

CategorySchema.path("name").validate((name) => {
  // numbers and special chars are not allowed
  let nameRegex = /^[a-zA-Z ]+$/;
  
  return nameRegex.test(name);
}, "The specified name is invalid.");

mongoose.model("Category", CategorySchema);
