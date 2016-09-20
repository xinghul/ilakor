"use strict";

let mongoose = require("mongoose")
,   Promise  = require("bluebird");

mongoose.promise = require("bluebird");

let Category = mongoose.model("Category")
,   ObjectId = mongoose.Types.ObjectId;

let CategoryApi = {
  
  /**
   * Creates a new category.
   * 
   * @param  {Object} rawData the raw data containing the new category info.
   *
   * @return {Promise}
   */
  add: function(rawData) {
    
    return new Promise((resolve, reject) => {
      
      let category = new Category(rawData);

      category.save((err, newCategory) => {
        if (err) {
          reject(err);
        } else {
          resolve(newCategory);
        }
      });
      
    });

  },
  
  /**
   * Removes category specified by given id, if it exists.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Promise}
   */
  remove: function(id) {
    
    return new Promise((resolve, reject) => {
      
      Category.remove({_id: ObjectId(id)}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
      
    });
    
  },
  
  /**
   * Updates category specified by given id with new value.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Promise}
   */
  update: function(id, newValue) {
    
    return new Promise((resolve, reject) => {
      
      Category.findOneAndUpdate({_id: ObjectId(id)}, {$set: newValue}, {new: true}, (err, updatedCategory) => {
        if (err) {
          reject(err);
        } else {
          resolve(updatedCategory);
        }
      });
      
    });
    
  },
  
  /**
   * Returns category specified by given id, if it exists.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Promise}
   */
  get: function(id) {
    
    return new Promise((resolve, reject) => {
      
      Category.findById(ObjectId(id), (err, result) => {
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
   * @return {Promise}
   */
  getAll: function() {
    
    return new Promise((resolve, reject) => {
      
      Category.find({}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
      
    });
    
  }

};

module.exports = CategoryApi;