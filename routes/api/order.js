"use strict";

let mongoose  = require("mongoose")
,   invariant = require("invariant")
,   Promise   = require("bluebird");

let Order    = mongoose.model("Order")
,   ObjectId = mongoose.Types.ObjectId;

let OrderApi = {
  
  /**
   * Creates a new order.
   * 
   * @param  {Object} rawData the raw data containing the new order info.
   *
   * @return {Promise} the new promise object.
   */
  add: function(rawData) {
    
    return new Promise(function(resolve, reject) {
      
      let order = new Order(rawData);

      order.save()
        .then(resolve)
        .catch(reject);
      
    });

  },
  
  /**
   * Returns order specified by given id, if it exists.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Promise} the new promise object.
   */
  get: function(id) {
    
    return new Promise(function(resolve, reject) {
      
      Order.findById(ObjectId(id))
        .then(resolve)
        .catch(reject);
      
    });
    
  },
  
  /**
   * Returns all orders.
   * 
   * @return {Promise} the new promise object.
   */
  getAll: function() {
    
    return new Promise(function(resolve, reject) {
      
      Order.find({})
        .then(resolve)
        .catch(reject);
        
    });
    
  }

};

module.exports = OrderApi;