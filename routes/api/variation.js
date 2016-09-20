"use strict";

let mongoose = require("mongoose")
,   Promise  = require("bluebird");

mongoose.promise = require("bluebird");

let Item      = mongoose.model("Item")
,   Variation = mongoose.model("Variation")
,   ObjectId  = mongoose.Types.ObjectId;

let VariationApi = {
  
  /**
   * Creates a new variation.
   * 
   * @param  {Object} rawData the raw data containing the new variation info.
   *
   * @return {Promise}
   */
  add: function(rawData) {
    
    return new Promise((resolve, reject) => {
      
      let variation = new Variation(rawData)
      ,   itemId = rawData.item;
      
      Item.findById(ObjectId(itemId)).then((item) => {
        
        item.variations.push(variation._id);
        
        item.save()
          .then(() => {
            return variation.save();
          })
          .then(resolve)
          .catch(reject);
          
      }).catch(reject);
      
    });

  },
  
  /**
   * Removes variation specified by given id, if it exists.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Promise}
   */
  remove: function(id) {
    
    return new Promise((resolve, reject) => {
      
      Variation.remove({_id: ObjectId(id)})
        .then(resolve)
        .catch(reject);
      
    });
    
  },
  
  /**
   * Updates variation specified by given id with new value.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Promise}
   */
  update: function(id, newValue) {
    
    return new Promise((resolve, reject) => {
      
      Variation.findOneAndUpdate({_id: ObjectId(id)}, {$set: newValue}, {new: true})
        .then(resolve)
        .catch(reject);
      
    });
    
  },
  
  /**
   * Returns variation specified by given id, if it exists.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Promise}
   */
  get: function(id) {
    
    return new Promise((resolve, reject) => {
      
      Variation.findById(ObjectId(id))
        .then(resolve)
        .catch(reject);
      
    });
    
  },
  
  /**
   * Returns all variations.
   * 
   * @return {Promise}
   */
  getAll: function() {
    
    return new Promise((resolve, reject) => {
      
      Variation.find({})
        .then(resolve)
        .catch(reject);
        
    });
    
  }

};

module.exports = VariationApi;