"use strict";

let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ItemSchema = new Schema({
  
  // name of the item
  name: {
    type: String,
    trim: true,
    required: true
  },
  
  // the tags of this item
  tag: {
    type: [{
      type: String,
      lowercase: true
    }],
    required: true
  },
  
  // image information containing names and urls on s3
  images: [{
    name: {
      type: String,
      lowercase: true
    },
    url: String
  }],
  
  // last update date
  lastUpdate: {
    type: Date,
    default: Date.now
  },

  // details about this Item
  // composition, color, etc
  description: Schema.Types.Mixed,
  
  price: {
    type: Number,
    required: true
  },
  
  outOfStock: {
    type: Boolean,
    default: false
  }
  
  // reviews, ref "Review"
  // on sale...

});

ItemSchema.pre("update", function() {
  this.update({}, {$set: { "lastUpdate": Date.now()}});
});

mongoose.model("Item", ItemSchema);
