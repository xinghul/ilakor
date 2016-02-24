"use strict";

let mongoose = require("mongoose")
,   Promise  = require("bluebird");

let Item     = mongoose.model("Item")
,   ObjectId = mongoose.Types.ObjectId;

let ItemApi = {
  
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
   * 	 tag: [String],
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
     
     return new Promise(function(resolve, reject) {
       
       let item = new Item(rawData);

       item.save(function(err, newItem) {
         if (err) {
           reject(err);
         } else {
           resolve(newItem);
         }
       });
       
     });

   },
   
   /**
    * Removes item specified by given id, if it exists.
    * 
    * @param  {String} id the specified id.
    *
    * @return {Promise} the new promise object.
    */
   remove: function(id) {
     
     return new Promise(function(resolve, reject) {
       
       Item.remove({_id: ObjectId(id)}, function(err, result) {
         if (err) {
           reject(err);
         } else {
           resolve(result);
         }
       });
       
     });
     
   },
   
   /**
    * Updates item specified by given id with new value.
    * 
    * @param  {String} id the specified id.
    *
    * @return {Promise} the new promise object.
    */
   update: function(id, newValue) {
     
     return new Promise(function(resolve, reject) {
       
       Item.findOneAndUpdate({_id: ObjectId(id)}, {$set: newValue}, {new: true}, function(err, updatedItem) {
         if (err) {
           reject(err);
         } else {
           console.log(updatedItem);
           resolve(updatedItem);
         }
       });
       
     });
     
   },
   
   /**
    * Returns item specified by given id, if it exists.
    * 
    * @param  {String} id the specified id.
    *
    * @return {Promise} the new promise object.
    */
   get: function(id) {
     
     return new Promise(function(resolve, reject) {
       
       Item.findById(ObjectId(id), function(err, result) {
         if (err) {
           reject(err);
         } else {
           resolve(result);
         }
       });
       
     });
     
   },
   
   /**
    * Returns all items.
    * 
    * @return {Promise} the new promise object.
    */
   getAll: function() {
     
     return new Promise(function(resolve, reject) {
       
       Item.find({}, function(err, result) {
         if (err) {
           reject(err);
         } else {
           resolve(result);
         }
       });
       
     });
     
   }

};

module.exports = ItemApi;