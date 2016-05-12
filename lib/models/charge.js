"use strict";

let mongoose = require("mongoose");

let Schema   = mongoose.Schema
,   ObjectId = Schema.Types.ObjectId;

let ChargeSchema = new Schema({
  
  user: {
    type: ObjectId,
    ref: "User",
    required: false
  },
  
  address: {
    name: String,
    phone: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zip: String
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
    source: String
  },
  
  items: [{
    type: ObjectId,
    ref: "Item"
  }],
  
  sent: {
    type: Boolean,
    default: false
  }

});

mongoose.model("Charge", ChargeSchema);
