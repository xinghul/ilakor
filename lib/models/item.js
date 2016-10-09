"use strict";

let mongoose = require("mongoose");

let Schema   = mongoose.Schema
,   ObjectId = Schema.Types.ObjectId;

let ItemSchema = new Schema({
  
  // name of the item
  name: {
    type: String,
    lowercase: true,
    trim: true,
    required: true
  },
  
  // the brand for this item
  brand: {
    type: ObjectId,
    ref: "Brand"
  },
  
  // the specific category for this item
  category: {
    type: ObjectId,
    ref: "Category"
  },
  
  // the tags of this item
  tags: [{
    type: ObjectId,
    ref: "Tag"
  }],
  
  // the variations of this item
  variations: [{
    type: ObjectId,
    ref: "Variation"
  }],
  
  // features of this item
  // eg, protein, bcaa
  features: [{
    key: {
      type: String,
      uppercase: true,
      trim: true
    },
    value: {
      type: String,
      uppercase: true,
      trim: true
    }
  }],
  
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
  description: Schema.Types.Mixed
  
  // reviews, ref "Review"
  // on sale...

});

ItemSchema.pre("update", function() {
  this.update({}, {$set: { "lastUpdate": Date.now()}});
});

mongoose.model("Item", ItemSchema);
