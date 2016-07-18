"use strict";

import request from "superagent-bluebird-promise"
import invariant from "invariant"
import _ from "lodash"
import Promise from "bluebird"

import AppDispatcher from "dispatcher/AppDispatcher"

import AccountConstants from "constants/AccountConstants"

let AccountActions = {
  
  /**
   * Returns orders specified by userId.
   * 
   * @param  {String} user the specified userId.
   * 
   * @return {Promise}
   */
  getOrders: function(userId) {
    
    invariant(_.isString(userId), `getOrders(userId) expects 'userId' to be 'string', but gets '${typeof userId}'.`);
    
    // mark as loading
    AppDispatcher.handleAction({
      actionType: AccountConstants.SETS_IS_LOADING,
      isLoading: true
    });
    
    return new Promise(function(resolve, reject) {
      
      request.get("/api/orders")
        .query({ user: userId })
        .then((res) => {
          let data = res.body;
          
          invariant(_.isArray(data), `getOrders(userId) expects response.body to be 'array', but gets '${typeof data}'.`);
          
          AppDispatcher.handleAction({
            actionType: AccountConstants.RECEIVED_ORDERS,
            orders: data
          });
      
          resolve();
        }).catch((err) => {
          let message = err.message;
          
          invariant(_.isString(message), `getOrders(userId) expects error.message to be 'string', but gets '${typeof message}'.`);
          
          reject(message);
        }).finally(() => {
          
          AppDispatcher.handleAction({
            actionType: AccountConstants.SETS_IS_LOADING,
            isLoading: false
          });
          
        });
    });
  }

};

export default AccountActions;
