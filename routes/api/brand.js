"use strict";

let mongoose = require("mongoose")
,   Promise  = require("bluebird");

mongoose.promise = require("bluebird");

let Brand    = mongoose.model("Brand")
,   ObjectId = mongoose.Types.ObjectId;

let BrandApi = {
  
  /**
   * Creates a new brand.
   * 
   * @param  {Object} rawData the raw data containing the new brand info.
   *
   * @return {Promise} the new promise object.
   */
  add: function(rawData) {
    
    return new Promise((resolve, reject) => {
      
      let brand = new Brand(rawData);

      brand.save((err, newBrand) => {
        if (err) {
          reject(err);
        } else {
          resolve(newBrand);
        }
      });
      
    });

  },
  
  /**
   * Removes brand specified by given id, if it exists.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Promise} the new promise object.
   */
  remove: function(id) {
    
    return new Promise((resolve, reject) => {
      
      Brand.remove({_id: ObjectId(id)}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
      
    });
    
  },
  
  /**
   * Updates brand specified by given id with new value.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Promise} the new promise object.
   */
  update: function(id, newValue) {
    
    return new Promise((resolve, reject) => {
      
      Brand.findOneAndUpdate({_id: ObjectId(id)}, {$set: newValue}, {new: true}, (err, updatedBrand) => {
        if (err) {
          reject(err);
        } else {
          resolve(updatedBrand);
        }
      });
      
    });
    
  },
  
  /**
   * Returns brand specified by given id, if it exists.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Promise} the new promise object.
   */
  get: function(id) {
    
    return new Promise((resolve, reject) => {
      
      Brand.findById(ObjectId(id), (err, result) => {
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
    
    return new Promise((resolve, reject) => {
      
      Brand.find({}, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
      
    });
    
  }

};

module.exports = BrandApi;