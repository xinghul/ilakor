"use strict";

let mongoose  = require("mongoose")
,   invariant = require("invariant")
,   Promise   = require("bluebird");

let Order    = mongoose.model("Order")
,   Item     = mongoose.model("Item")
,   ObjectId = mongoose.Types.ObjectId;

let OrderApi = {
  
  /**
   * Creates a new order.
   * 
   * @param  {Object} rawData the raw data containing the new order info.
   *
   * @return {Promise}
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
   * @return {Promise}
   */
  get: function(id) {
    
    return new Promise(function(resolve, reject) {
      
      Order.findById(ObjectId(id))
        .populate("user")
        .populate([
          { path: "items.item", model: "Item" },
          { path: "items.variation", model: "Variation" }
        ])
        .then(resolve)
        .catch(reject);
      
    });
    
  },
  
  /**
   * Returns all orders.
   * 
   * @return {Promise}
   */
  getAll: function() {
    
    return new Promise(function(resolve, reject) {
      
      Order
        .find({})
        .populate("user")
        .populate([
          { path: "items.item", model: "Item" },
          { path: "items.variation", model: "Variation" }
        ])
        .exec()
        .then(resolve)
        .catch(reject);
        
    });
    
  },
  
  /**
   * Returns all orders specified by user id.
   * 
   * @param  {String} userId the specified user id for the orders.
   * 
   * @return {Promise}
   */
  getAllByUserId: function(userId) {
    
    return new Promise(function(resolve, reject) {
      
      Order
        .find({ user: userId })
        .populate("user")
        .populate([
          { path: "items.item", model: "Item" },
          { path: "items.variation", model: "Variation" }
        ])
        .exec()
        .then(resolve)
        .catch(reject);
        
    });
    
  },
  
  /**
   * Updates order specified by given id with new value.
   * 
   * @param  {String} id the specified id.
   *
   * @return {Promise}
   */
  update: function(id, newValue) {

    return new Promise(function(resolve, reject) {
      
      Order
        .findOneAndUpdate({_id: ObjectId(id)}, {$set: newValue}, {new: true})
        .populate("user items")
        .exec()
        .then(resolve)
        .catch(reject);
              
    });
    
  }

};

module.exports = OrderApi;