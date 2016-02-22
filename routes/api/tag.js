"use strict";

let mongoose = require("mongoose")
,   Promise  = require("bluebird");

let Tag      = mongoose.model("Tag")
,   ObjectId = mongoose.Types.ObjectId;

let TagApi = {
  
  /**
   * Creates a new tag.
   * 
   * @param  {Object} rawData the raw data containing the new tag info.
   *
   * @return {Promise} the new promise object.
   *
   * rawData schema:
   * {
   * 	 name: String
   * }
   */
  add: function(rawData) {
    
    return new Promise(function(resolve, reject) {
      
      let tag = new Tag(rawData);

      tag.save(function(err, newTag) {
        if (err) {
          reject(err);
        } else {
          resolve(newTag);
        }
      });
      
    });

  },
  
  /**
   * Removes tag specified by given id, if it exists.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Promise} the new promise object.
   */
  remove: function(id) {
    
    return new Promise(function(resolve, reject) {
      
      Tag.remove({_id: ObjectId(id)}, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
      
    });
    
  },
  
  /**
   * Updates tag specified by given id with new value.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Promise} the new promise object.
   */
  update: function(id, newValue) {
    
    return new Promise(function(resolve, reject) {
      
      Tag.findOneAndUpdate({_id: ObjectId(id)}, {$set: newValue}, {new: true}, function(err, updatedTag) {
        if (err) {
          reject(err);
        } else {
          resolve(updatedTag);
        }
      });
      
    });
    
  },
  
  /**
   * Returns tag specified by given id, if it exists.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Promise} the new promise object.
   */
  get: function(id) {
    
    return new Promise(function(resolve, reject) {
      
      Tag.findById(ObjectId(id), function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
      
    });
    
  },
  
  /**
   * Returns all tags.
   * 
   * @return {Promise} the new promise object.
   */
  getAll: function() {
    
    return new Promise(function(resolve, reject) {
      
      Tag.find({}, function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
      
    });
    
  }

};

module.exports = TagApi;