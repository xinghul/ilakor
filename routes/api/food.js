+function(undefined) {
"use strict";

var mongoose = require("mongoose")
,   Promise  = require("bluebird");

var Food     = mongoose.model("Food")
,   ObjectId = mongoose.Types.ObjectId;

var FoodApi = {

  add: function(rawData) {
    
    var deferred = Promise.defer();
    
    var food = new Food(rawData);

    // do a check here
    food.save(function(err, newFood) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(newFood);
      }
    });
    
    return deferred.promise;
  },

  getAll: function() {
    var deferred = Promise.defer();
    
    Food.find({}, function(err, result) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(result);
      }
    });
    
    return deferred.promise;
  }

};

module.exports = FoodApi;

}();
