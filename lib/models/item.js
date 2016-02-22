"use strict";

let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ItemSchema = new Schema({
  
  // name of the item
  name: {
    type: String,
    required: true
  },
  
  // which category/categories this item belongs to
  category: {
    type: [String],
    required: true
  },
  
  // unit: pound
  weight: {
    type: Number,
    required: true
  },
  
  // image src for this item
  image: [String],
  
  // length x width x heigth, inches
  dimension: {    
    length: Number,
    width: Number,
    height: Number
  },
  
  // details about this Item
  // composition, color, etc
  description: Schema.Types.Mixed

});

mongoose.model("Item", ItemSchema);
