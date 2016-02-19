"use strict";

var mongoose = require("mongoose")
,   Promise  = require("bluebird");

var Item     = mongoose.model("Item")
,   ObjectId = mongoose.Types.ObjectId;

var ItemApi = {
  
  /**
   * Creates a new item.
   * 
   * @param  {Object} rawData the raw data containing the new item info.
   *
   * @return {Object} the promise object.
   *
   * rawData schema:
   * {
   * 	 name: String,
   * 	 category: [String],
   * 	 image: [String],
   * 	 weight: Number,
   * 	 dimension: {
   * 	 	length: Number,
   * 		width: Number,
   * 		height: Number
   * 	 },
   * 	 description: { ... }
   * }
   */
  add: function(rawData) {
    var deferred = Promise.defer();
    
    var item = new Item(rawData);

    item.save(function(err, newItem) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(newItem);
      }
    });
    
    return deferred.promise;
  },
  
  /**
   * Removes item specified by given id, if it exists.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Object} the promise object.
   */
  remove: function(id) {
    var deferred = Promise.defer();
    
    Item.remove({_id: ObjectId(id)}, function(err, result) {
      if (err) {
        console.log(err);
        deferred.reject(err);
      } else {
        console.log(result);
        deferred.resolve(result);
      }
    });
    
    return deferred.promise;
  },
  
  /**
   * Updates item specified by given id with new value.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Object} the promise object.
   */
  update: function(id, newValue) {
    var deferred = Promise.defer();
    
    Item.update({_id: ObjectId(id)}, { $set: newValue }, function(err, result) {
      if (err) {
        deferred.reject(err);
      } else {
        // resolve the new value instead
        deferred.resolve(newValue);
      }
    });
    
    return deferred.promise;
  },
  
  /**
   * Returns item specified by given id, if it exists.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Object} the promise object.
   */
  get: function(id) {
    var deferred = Promise.defer();
    
    Item.findById(ObjectId(id), function(err, result) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(result);
      }
    });
    
    return deferred.promise;
  },
  
  /**
   * Returns all items.
   * 
   * @return {Object} the promise object.
   */
  getAll: function() {
    var deferred = Promise.defer();
    
    Item.find({}, function(err, result) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(result);
      }
    });
    
    return deferred.promise;
  }

};

module.exports = ItemApi;