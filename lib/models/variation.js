'use strict';

let mongoose = require('mongoose');

let Schema   = mongoose.Schema
,   ObjectId = Schema.Types.ObjectId;

let VariationSchema = new Schema({
  
  itemId: {
    type: ObjectId,
    ref: "Item",
    required: true
  },
  
  info: Schema.Types.Mixed,
  
  price: {
    type: Number,
    required: true
  },
  
  outOfStock: {
    type: Boolean,
    default: false
  }

});

mongoose.model('Variation', VariationSchema);
