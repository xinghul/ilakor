+function(undefined) {
"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var FoodSchema = new Schema({
  
  name: {
    type: String,
    required: true
  },
  
  group: {
    type: String,
    required: true
  },
  
  nutrient: Schema.Types.Mixed

});

mongoose.model("Food", FoodSchema);

}();
