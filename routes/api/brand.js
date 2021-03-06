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
   * @return {Promise}
   */
  add: function(rawData) {
    
    return new Promise((resolve, reject) => {
      
      let brand = new Brand(rawData);

      brand.save()
        .then(resolve)
        .catch(reject);
      
    });

  },
  
  /**
   * Removes brand specified by given id, if it exists.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Promise}
   */
  remove: function(id) {
    
    return new Promise((resolve, reject) => {
      
      Brand.remove({_id: ObjectId(id)})
        .then(resolve)
        .catch(reject);
      
    });
    
  },
  
  /**
   * Updates brand specified by given id with new value.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Promise}
   */
  update: function(id, newValue) {
    
    return new Promise((resolve, reject) => {
      
      Brand.findOneAndUpdate({_id: ObjectId(id)}, {$set: newValue}, {new: true})
        .then(resolve)
        .catch(reject);
      
    });
    
  },
  
  /**
   * Returns brand specified by given id, if it exists.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Promise}
   */
  get: function(id) {
    
    return new Promise((resolve, reject) => {
      
      Brand.findById(ObjectId(id))
        .then(resolve)
        .catch(reject);
      
    });
    
  },
  
  /**
   * Returns all tags.
   * 
   * @return {Promise}
   */
  getAll: function() {
    
    return new Promise((resolve, reject) => {
      
      Brand.find({})
        .then(resolve)
        .catch(reject);
      
    });
    
  }

};

module.exports = BrandApi;