"use strict";

let mongoose = require("mongoose")
,   Promise  = require("bluebird");

let Charge   = mongoose.model("Charge")
,   ObjectId = mongoose.Types.ObjectId;

let ChargeApi = {
  
  /**
   * Creates a new charge.
   * 
   * @param  {Object} rawData the raw data containing the new charge info.
   *
   * @return {Promise} the new promise object.
   */
  add: function(rawData) {
    
    return new Promise(function(resolve, reject) {
      
      let charge = new Charge(rawData);

      charge.save(function(err, newCharge) {
        if (err) {
          reject(err);
        } else {
          resolve(newCharge);
        }
      });
      
    });

  }

};

module.exports = ChargeApi;