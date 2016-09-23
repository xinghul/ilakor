"use strict";

let mongoose = require("mongoose");

let Schema   = mongoose.Schema
,   ObjectId = Schema.Types.ObjectId;

let OrderSchema = new Schema({
  
  user: {
    type: ObjectId,
    ref: "User",
    required: true
  },
  
  charge: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: "usd"
    },
    source: Schema.Types.Mixed
  },
  
  payment: Object,
  
  address: Object,
  
  stripe: Object,
  
  items: [{
    count: Number,
    item: {
      type: ObjectId,
      ref: "Item"
    },
    variation: {
      type: ObjectId,
      ref: "Variation"
    }
  }],
  
  sent: {
    type: Boolean,
    default: false
  },
  
  created: {
    type: Date,
    default: Date.now()
  }
  
});


mongoose.model("Order", OrderSchema);
