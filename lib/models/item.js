"use strict";

let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ItemSchema = new Schema({
  
  // name of the item
  name: {
    type: String,
    required: true
  },
  
  // the tags of this item
  tag: {
    type: [String],
    required: true
  },
  
  // unit: pound
  weight: {
    type: Number,
    required: true
  },
  
  // image information containing names and urls on s3
  images: [{
    name: String,
    url: String
  }],
  
  // length x width x heigth, inches
  dimension: {    
    length: Number,
    width: Number,
    height: Number
  },
  
  // unit number for this item
  unitNumber: String,
  
  // unit name for this item
  unitName: String,

  // unit type for this item
  unitType: String,
  
  // last update date
  lastUpdate: {
    type: Date,
    default: Date.now
  },

  // details about this Item
  // composition, color, etc
  description: Schema.Types.Mixed

});

ItemSchema.pre("update", function() {
  this.update({}, {$set: { "lastUpdate": Date.now()}});
});

mongoose.model("Item", ItemSchema);
