'use strict';

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let BrandSchema = new Schema({
  
  // name of the brand
  name: {
    type: String,
    lowercase: true,
    trim: true,
    required: true
  }

});

BrandSchema.path('name').validate((name) => {
  // numbers and special chars are not allowed
  let nameRegex = /^[a-zA-Z ]+$/;
  
  return nameRegex.test(name);
}, 'The specified name is invalid.');

mongoose.model('Brand', BrandSchema);
